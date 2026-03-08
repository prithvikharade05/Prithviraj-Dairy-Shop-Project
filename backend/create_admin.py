import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Profile

# Create admin user
user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@milk.com',
        'is_staff': True,
        'is_superuser': True
    }
)
user.set_password('admin123')
user.save()

# Create profile with admin flag
profile, profile_created = Profile.objects.get_or_create(
    user=user,
    defaults={'is_admin': True}
)

if not profile.is_admin:
    profile.is_admin = True
    profile.save()

if created:
    print("Admin user created successfully!")
else:
    print("Admin user already exists, updated if needed!")

print(f"Username: admin")
print(f"Password: admin123")

