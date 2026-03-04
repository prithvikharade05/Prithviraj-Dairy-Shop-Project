# Premium Dairy E-Commerce Website

A modern, premium dairy e-commerce website built with Django (Backend) and React (Frontend).

## Features

- 🛒 Shopping Cart with persistent storage
- 👤 User Authentication (JWT)
- 💳 Cash on Delivery (COD) payment
- 🎨 Premium glassmorphism design
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive

## Tech Stack

### Backend
- Django 5.x
- Django REST Framework
- JWT Authentication
- SQLite Database
- CORS Headers

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide React Icons

## Project Structure

```
milk/
├── backend/              # Django backend
│   ├── backend/         # Main project settings
│   ├── store/           # Store app (models, views, serializers)
│   ├── media/           # Product images
│   └── manage.py
├── frontend/            # React Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Auth, Cart, Toast)
│   │   ├── services/   # API services
│   │   └── assets/     # Static assets
│   └── package.json
├── SETUP_GUIDE.md      # Setup instructions
└── README.md
```

## Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Seed sample products
python manage.py seed_products

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | Login user |
| GET | `/api/products/` | List all products |
| GET | `/api/products/{id}/` | Get product detail |
| GET | `/api/cart/` | Get user's cart |
| POST | `/api/cart/` | Add item to cart |
| PUT | `/api/cart/` | Update cart item |
| DELETE | `/api/cart/` | Remove item from cart |
| POST | `/api/orders/place/` | Place order (COD) |
| GET | `/api/orders/` | Get user's orders |

## Design Features

- **Gradient Background**: Deep purple-indigo-blue gradient
- **Glassmorphism Cards**: Frosted glass effect with blur
- **Glowing Effects**: Purple glow on hover
- **Smooth Animations**: Framer Motion transitions
- **Premium Typography**: Inter font family
- **Responsive**: Mobile-first design

## License

MIT License

