"""
API Views for store.
"""
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Profile, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    UserSerializer, ProductSerializer, ProductCreateSerializer, CartSerializer,
    CartItemSerializer, OrderSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, PlaceOrderSerializer, AdminOrderUpdateSerializer
)


class RegisterView(generics.CreateAPIView):
    """View for user registration."""
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """View for user login."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user is admin
        is_admin = False
        try:
            is_admin = user.profile.is_admin
        except Profile.DoesNotExist:
            pass
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'is_admin': is_admin,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class ProductListView(generics.ListAPIView):
    """View for listing all products."""
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    """View for getting product details."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class CartView(APIView):
    """View for managing user's cart."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get user's cart."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart."""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if product.stock < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response(
            {'message': 'Item added to cart', 'cart': CartSerializer(cart).data},
            status=status.HTTP_200_OK
        )

    def put(self, request):
        """Update cart item quantity."""
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if quantity <= 0:
            cart_item.delete()
            return Response(
                {'message': 'Item removed from cart'},
                status=status.HTTP_200_OK
            )
        
        if cart_item.product.stock < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()
        
        cart = Cart.objects.get(user=request.user)
        return Response(
            {'message': 'Cart updated', 'cart': CartSerializer(cart).data},
            status=status.HTTP_200_OK
        )

    def delete(self, request):
        """Remove item from cart."""
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart = Cart.objects.get(user=request.user)
        return Response(
            {'message': 'Item removed from cart', 'cart': CartSerializer(cart).data},
            status=status.HTTP_200_OK
        )


class PlaceOrderView(APIView):
    """View for placing an order (Cash on Delivery)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Place order."""
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate total
        total_amount = 0
        for item in cart.items.all():
            total_amount += item.get_total()
        
        # Get optional fields
        shipping_address = serializer.validated_data.get('shipping_address', '')
        phone = serializer.validated_data.get('phone', '')
        
        # Create order (order_id will be auto-generated)
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            payment_method='COD',
            status='Pending',
            shipping_address=shipping_address,
            phone=phone
        )
        
        # Create order items and reduce stock
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            # Reduce stock
            item.product.stock -= item.quantity
            item.product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response(
            {
                'message': 'Order placed successfully',
                'order': OrderSerializer(order).data
            },
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):
    """View for listing user's orders."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get orders for current user."""
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    """View for getting order details."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get order for current user."""
        return Order.objects.filter(user=self.request.user)


# ==================== ADMIN VIEWS ====================

class IsAdminUser(permissions.BasePermission):
    """Permission check for admin users."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.is_admin
        except Profile.DoesNotExist:
            return False


class AdminLoginView(APIView):
    """View for admin login."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user is admin
        try:
            if not user.profile.is_admin:
                return Response(
                    {'error': 'Access denied. Admin privileges required.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Access denied. Admin privileges required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'is_admin': True,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Admin login successful'
        }, status=status.HTTP_200_OK)


class AdminDashboardView(APIView):
    """View for admin dashboard statistics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get dashboard statistics."""
        # Total orders
        total_orders = Order.objects.count()
        
        # Total revenue
        total_revenue = Order.objects.exclude(status='Cancelled').aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        # Orders by status
        orders_by_status = Order.objects.values('status').annotate(
            count=Count('id')
        )
        
        # Today's orders
        today = timezone.now().date()
        today_orders = Order.objects.filter(created_at__date=today).count()
        today_revenue = Order.objects.filter(
            created_at__date=today
        ).exclude(status='Cancelled').aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        # Recent orders (last 10)
        recent_orders = Order.objects.order_by('-created_at')[:10]
        
        # Last 7 days order statistics
        week_stats = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_orders = Order.objects.filter(created_at__date=day).count()
            day_revenue = Order.objects.filter(
                created_at__date=day
            ).exclude(status='Cancelled').aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            week_stats.append({
                'date': day.strftime('%Y-%m-%d'),
                'orders': day_orders,
                'revenue': float(day_revenue)
            })
        
        # Pending orders count
        pending_orders = Order.objects.filter(status='Pending').count()
        
        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'orders_by_status': list(orders_by_status),
            'today_orders': today_orders,
            'today_revenue': float(today_revenue),
            'pending_orders': pending_orders,
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
            'week_stats': week_stats
        }, status=status.HTTP_200_OK)


class AdminOrderListView(APIView):
    """View for admin to list all orders."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get all orders with optional filtering."""
        status_filter = request.query_params.get('status', None)
        
        orders = Order.objects.all().order_by('-created_at')
        
        if status_filter:
            orders = orders.filter(status=status_filter)
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminOrderDetailView(APIView):
    """View for admin to get/update specific order."""
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        """Get order details."""
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update order status."""
        serializer = AdminOrderUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        new_status = serializer.validated_data['status']
        old_status = order.status
        order.status = new_status
        order.save()
        
        # If order is cancelled, restore stock
        if new_status == 'Cancelled' and old_status != 'Cancelled':
            for item in order.items.all():
                item.product.stock += item.quantity
                item.product.save()
        
        return Response({
            'message': f'Order status updated from {old_status} to {new_status}',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_200_OK)


class AdminProductListView(APIView):
    """View for admin to manage products."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """List all products."""
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create new product."""
        serializer = ProductCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            {
                'message': 'Product created successfully',
                'product': ProductSerializer(product).data
            },
            status=status.HTTP_201_CREATED
        )


class AdminProductDetailView(APIView):
    """View for admin to update/delete specific product."""
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        """Get product details."""
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update product."""
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProductCreateSerializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        return Response(
            {
                'message': 'Product updated successfully',
                'product': ProductSerializer(product).data
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        """Delete product."""
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        product.delete()
        
        return Response(
            {'message': 'Product deleted successfully'},
            status=status.HTTP_200_OK
        )


class AdminUserListView(APIView):
    """View for admin to list all users."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """List all users with their profiles."""
        from django.contrib.auth.models import User
        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

