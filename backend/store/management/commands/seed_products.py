"""
Management command to seed Indian dairy products.
"""
from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    help = 'Seed Indian dairy products for Prithviraj Milk Shop'

    def handle(self, *args, **kwargs):
        products = [
            {
                'name': 'Full Cream Milk',
                'description': 'Rich and creamy full cream milk, packed with essential nutrients and calcium. Perfect for daily consumption.',
                'price': 60.00,
                'category': 'Milk',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
            },
            {
                'name': 'Toned Milk',
                'description': 'Healthy toned milk with reduced fat content. Ideal for health-conscious families.',
                'price': 55.00,
                'category': 'Milk',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
            },
            {
                'name': 'Cow Ghee',
                'description': 'Pure desi cow ghee made from the finest quality butter. Authentic taste and aroma.',
                'price': 650.00,
                'category': 'Ghee',
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop',
            },
            {
                'name': 'Buffalo Ghee',
                'description': 'Premium buffalo ghee with rich texture and authentic flavor. Perfect for cooking and traditional recipes.',
                'price': 720.00,
                'category': 'Ghee',
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop',
            },
            {
                'name': 'Paneer (500g)',
                'description': 'Fresh and soft paneer made from pure milk. Perfect for curries, parathas, and snacks.',
                'price': 280.00,
                'category': 'Paneer',
                'stock': 60,
                'image_url': 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=400&h=400&fit=crop',
            },
            {
                'name': 'Fresh Curd',
                'description': 'Thick and creamy fresh curd made from pure milk. Rich in probiotics for gut health.',
                'price': 45.00,
                'category': 'Curd',
                'stock': 80,
                'image_url': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
            },
            {
                'name': 'Butter (Amul style)',
                'description': 'Creamy butter with authentic taste. Perfect for baking, cooking, and spreading.',
                'price': 120.00,
                'category': 'Butter',
                'stock': 70,
                'image_url': 'https://images.unsplash.com/photo-1589985270958-bf087b4c9e0c?w=400&h=400&fit=crop',
            },
            {
                'name': 'Buttermilk',
                'description': 'Refreshing traditional buttermilk (Chaas). Cool and healthy drink for hot days.',
                'price': 25.00,
                'category': 'Beverages',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
            },
            {
                'name': 'Lassi',
                'description': 'Traditional sweet lassi made with fresh curd. A delicious and refreshing drink.',
                'price': 40.00,
                'category': 'Beverages',
                'stock': 90,
                'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
            },
            {
                'name': 'Khoya',
                'description': 'Fresh khoya (mava) for traditional sweets. Perfect for making gulab jamun, halwa, and more.',
                'price': 380.00,
                'category': 'Sweets',
                'stock': 40,
                'image_url': 'https://images.unsplash.com/photo-1599639668273-41d7364fc51a?w=400&h=400&fit=crop',
            },
        ]

        # Clear existing products
        Product.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing products'))

        for product_data in products:
            product = Product.objects.create(**product_data)
            self.stdout.write(self.style.SUCCESS(f'Created: {product.name} - ₹{product.price}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(products)} Indian dairy products!'))
