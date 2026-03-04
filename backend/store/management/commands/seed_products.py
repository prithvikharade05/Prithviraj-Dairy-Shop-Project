"""
Management command to seed sample dairy products.
"""
from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    help = 'Seed sample dairy products'

    def handle(self, *args, **kwargs):
        products = [
            {
                'name': 'Fresh Organic Milk',
                'description': 'Pure organic milk from grass-fed cows. Rich in calcium and vitamins.',
                'price': 4.99,
                'category': 'Milk',
                'stock': 100,
            },
            {
                'name': 'Premium Greek Yogurt',
                'description': 'Creamy authentic Greek yogurt with live cultures. Perfect for breakfast.',
                'price': 3.49,
                'category': 'Yogurt',
                'stock': 80,
            },
            {
                'name': 'Artisan Cheese Box',
                'description': 'Selection of fine artisan cheeses including cheddar, brie, and gouda.',
                'price': 12.99,
                'category': 'Cheese',
                'stock': 50,
            },
            {
                'name': 'Fresh Farm Eggs',
                'description': 'Free-range eggs from local farms. Rich golden yolks.',
                'price': 5.99,
                'category': 'Eggs',
                'stock': 120,
            },
            {
                'name': 'Organic Butter',
                'description': 'Hand-churned organic butter. Perfect for baking and cooking.',
                'price': 6.99,
                'category': 'Butter',
                'stock': 60,
            },
            {
                'name': 'Fresh Cream',
                'description': 'Heavy whipping cream for desserts and coffee.',
                'price': 4.49,
                'category': 'Cream',
                'stock': 70,
            },
            {
                'name': 'Cottage Cheese',
                'description': 'Low-fat cottage cheese packed with protein.',
                'price': 3.99,
                'category': 'Cheese',
                'stock': 65,
            },
            {
                'name': 'Chocolate Milk',
                'description': 'Rich and creamy chocolate milk made with real cocoa.',
                'price': 3.49,
                'category': 'Milk',
                'stock': 90,
            },
        ]

        for product_data in products:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created: {product.name}'))
            else:
                self.stdout.write(f'Already exists: {product.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded products!'))

