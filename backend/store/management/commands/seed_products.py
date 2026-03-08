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
                'price': 70.00,
                'category': 'Milk',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?q=80&w=943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
                'name': 'Toned Milk',
                'description': 'Healthy toned milk with reduced fat content. Ideal for health-conscious families.',
                'price': 60.00,
                'category': 'Milk',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1591609009692-34b65eb9ee18?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
                'name': 'Cow Ghee',
                'description': 'Pure desi cow ghee made from the finest quality butter. Authentic taste and aroma.',
                'price': 650.00,
                'category': 'Ghee',
                'stock': 50,
                'image_url': 'https://5.imimg.com/data5/SELLER/Default/2024/9/451515081/CC/FE/XL/151381977/shudh-desi-ghee-1000x1000.jpeg',
            },
            {
                'name': 'Buffalo Ghee',
                'description': 'Premium buffalo ghee with rich texture and authentic flavor. Perfect for cooking and traditional recipes.',
                'price': 700.00,
                'category': 'Ghee',
                'stock': 50,
                'image_url': 'https://thumbs.dreamstime.com/b/ghee-jar-meadow-selective-focus-food-406822139.jpg',
            },
            {
                'name': 'Paneer (500g)',
                'description': 'Fresh and soft paneer made from pure milk. Perfect for curries, parathas, and snacks.',
                'price': 250.00,
                'category': 'Paneer',
                'stock': 60,
                'image_url': 'https://newsmeter.in/h-upload/2025/02/13/394708-20250213175015.webp',
            },
            {
                'name': 'Fresh Curd',
                'description': 'Thick and creamy fresh curd made from pure milk. Rich in probiotics for gut health.',
                'price': 50.00,
                'category': 'Curd',
                'stock': 80,
                'image_url': 'https://media.istockphoto.com/id/1214850940/photo/yogurt-is-good-for-health-with-black-background.jpg?s=612x612&w=0&k=20&c=8GqPjqx9ykwamtCXQE_lOfsQRTQE89RxzBz2kcndXEg=',
            },
            {
                'name': 'Butter (Amul style)',
                'description': 'Creamy butter with authentic taste. Perfect for baking, cooking, and spreading.',
                'price': 120.00,
                'category': 'Butter',
                'stock': 70,
                'image_url': 'https://www.nutralite.com/wp-content/uploads/2025/01/Butter-basics.jpg',
            },
            {
                'name': 'Buttermilk',
                'description': 'Refreshing traditional buttermilk (Chaas). Cool and healthy drink for hot days.',
                'price': 40.00,
                'category': 'Beverages',
                'stock': 100,
                'image_url': 'https://www.awesomecuisine.com/wp-content/uploads/2008/11/masala-buttermilk.jpg',
            },
            {
                'name': 'Lassi',
                'description': 'Traditional sweet lassi made with fresh curd. A delicious and refreshing drink.',
                'price': 50.00,
                'category': 'Beverages',
                'stock': 90,
                'image_url': 'https://www.indianveggiedelight.com/wp-content/uploads/2023/01/sweet-lassi-recipe-featured.jpg',
            },
            {
                'name': 'Khoya',
                'description': 'Fresh khoya (mava) for traditional sweets. Perfect for making gulab jamun, halwa, and more.',
                'price': 300.00,
                'category': 'Sweets',
                'stock': 40,
                'image_url': 'https://www.chezshuchi.com/images/homemade-khoya.JPG',
            },
        ]

        # Clear existing products
        Product.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing products'))

        for product_data in products:
            product = Product.objects.create(**product_data)
            self.stdout.write(self.style.SUCCESS(f'Created: {product.name} - ₹{product.price}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(products)} Indian dairy products!'))
