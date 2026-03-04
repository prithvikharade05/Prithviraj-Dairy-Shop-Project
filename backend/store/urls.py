"""
URL configuration for store app.
"""
from django.urls import path
from .views import (
    RegisterView, LoginView, ProductListView, ProductDetailView,
    CartView, PlaceOrderView, OrderListView, OrderDetailView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    
    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    
    # Orders
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/place/', PlaceOrderView.as_view(), name='place-order'),
]

