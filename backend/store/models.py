"""
Store models for dairy e-commerce.
"""
from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import datetime


class Profile(models.Model):
    """Extended user profile with admin flag."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {'Admin' if self.is_admin else 'User'}"


class Product(models.Model):
    """Product model for dairy items."""
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="External image URL (e.g., from Unsplash)")
    category = models.CharField(max_length=100, default='Dairy')
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Cart(models.Model):
    """Cart model for user shopping cart."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    def get_total(self):
        """Calculate total price of cart items."""
        total = 0
        for item in self.items.all():
            total += item.get_total()
        return total


class CartItem(models.Model):
    """CartItem model for items in cart."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    def get_total(self):
        """Calculate total price for this cart item."""
        return self.product.price * self.quantity


class Order(models.Model):
    """Order model for completed purchases."""
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('COD', 'Cash on Delivery'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default='COD')
    shipping_address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.order_id} by {self.user.username}"

    def save(self, *args, **kwargs):
        if not self.order_id:
            # Generate unique order ID: ORD-YYYYMMDD-XXXX
            date_str = datetime.now().strftime('%Y%m%d')
            last_order = Order.objects.filter(order_id__startswith=f'ORD-{date_str}').order_by('-order_id').first()
            if last_order:
                last_num = int(last_order.order_id.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.order_id = f'ORD-{date_str}-{str(new_num).zfill(4)}'
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """OrderItem model for items in an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    def get_total(self):
        """Calculate total price for this order item."""
        return self.price * self.quantity
