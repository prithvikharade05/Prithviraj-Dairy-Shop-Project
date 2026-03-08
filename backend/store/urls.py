"""
URL configuration for store app.
"""
from django.urls import path
from .views import (
    RegisterView, LoginView, ProductListView, ProductDetailView,
    CartView, PlaceOrderView, OrderListView, OrderDetailView,
    # Admin views
    AdminLoginView, AdminDashboardView, AdminOrderListView, AdminOrderDetailView,
    AdminProductListView, AdminProductDetailView, AdminUserListView
)
from django.conf import settings
from django.conf.urls.static import static

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
    
    # Admin Authentication
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    
    # Admin Dashboard
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Admin Orders
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    
    # Admin Products
    path('admin/products/', AdminProductListView.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    
    # Admin Users
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
]

