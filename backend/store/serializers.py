"""
Serializers for store models.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Product, Cart, CartItem, Order, OrderItem


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'username', 'email', 'is_admin', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_admin']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_is_admin(self, obj):
        """Check if user is admin."""
        try:
            return obj.profile.is_admin
        except Profile.DoesNotExist:
            return False

    def create(self, validated_data):
        """Create a new user with encrypted password."""
        user = User.objects.create_user(**validated_data)
        # Create profile for user
        Profile.objects.create(user=user, is_admin=False)
        return user


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'image_url', 'category', 'stock', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        """Get full image URL - prioritizes external image_url, falls back to local image."""
        # First, check if there's an external URL (from seed data or manual entry)
        if obj.image_url:
            return obj.image_url
        # Second, check if there's a local image upload
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products (admin)."""
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'image_url', 'category', 'stock']


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model."""
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']
    
    def get_total_price(self, obj):
        """Get total price for this cart item."""
        return obj.get_total()


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model."""
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total', 'created_at']
    
    def get_total(self, obj):
        """Get total price of cart."""
        return obj.get_total()


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    product_name = serializers.SerializerMethodField()
    product_id = serializers.SerializerMethodField()
    item_total = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'price', 'item_total']
    
    def get_product_name(self, obj):
        """Get product name."""
        return obj.product.name
    
    def get_product_id(self, obj):
        """Get product ID."""
        return obj.product.id
    
    def get_item_total(self, obj):
        """Get total price."""
        return float(obj.get_total())


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    order_id_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_id', 'order_id_display', 'user', 'user_username', 'user_email', 'items', 'total_amount', 'status', 'payment_method', 'shipping_address', 'phone', 'created_at', 'updated_at']
    
    def get_user_username(self, obj):
        """Get username."""
        return obj.user.username
    
    def get_user_email(self, obj):
        """Get user email."""
        return obj.user.email
    
    def get_order_id_display(self, obj):
        """Get order ID for display, fallback to id if order_id is None."""
        return obj.order_id or f"ORD-OLD-{obj.id}"


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding item to cart."""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""
    quantity = serializers.IntegerField(min_value=1)


class PlaceOrderSerializer(serializers.Serializer):
    """Serializer for placing an order."""
    shipping_address = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)


class AdminOrderUpdateSerializer(serializers.Serializer):
    """Serializer for admin to update order status."""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)

