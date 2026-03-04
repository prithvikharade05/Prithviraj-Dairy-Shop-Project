# Premium Dairy E-Commerce - Setup Guide

## STEP 1: BACKEND COMMANDS (Run these in your terminal)

### Create and activate virtual environment
```bash
cd c:/Users/eknat/OneDrive/Desktop/milk
python -m venv venv
```

### Activate virtual environment (Windows)
```bash
venv\Scripts\activate
```

### Install Django and dependencies
```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install pillow
```

### Create Django project
```bash
django-admin startproject backend .
```

### Create store app
```bash
python manage.py startapp store
```

---

## STEP 2: FRONTEND COMMANDS (Run these in your terminal)

### Create Vite React app
```bash
cd c:/Users/eknat/OneDrive/Desktop/milk
npm create vite@latest frontend -- --template react
```

### Install frontend dependencies
```bash
cd frontend
npm install
npm install react-router-dom axios framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## STEP 3: RUNNING THE SERVERS

### Backend (Terminal 1)
```bash
cd c:/Users/eknat/OneDrive/Desktop/milk/backend
venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```

### Frontend (Terminal 2)
```bash
cd c:/Users/eknat/OneDrive/Desktop/milk/frontend
npm run dev
```

---

## PROJECT STRUCTURE

```
milk/
├── backend/              # Django project
│   ├── backend/         # Main project settings
│   ├── store/           # Store app
│   ├── media/           # Product images
│   └── manage.py
├── frontend/            # React Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
├── venv/                # Virtual environment
└── README.md
```

