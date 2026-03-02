# Mk Shop - Backend & Dashboard Setup

This project now includes a **full backend API**, **admin dashboard**, and **dynamic data** for the e-commerce store.

## Features

### Backend API (JSON-file based)
- **Products** - CRUD at `/api/products`
- **Categories** - CRUD at `/api/categories`
- **Deals** - CRUD at `/api/deals`
- **Blog** - CRUD at `/api/blog`
- **Orders** - Create & list at `/api/orders`
- **Auth** - Login/Logout at `/api/auth/login`, `/api/auth/logout`

### Admin Dashboard
- **URL**: `/dashboard` (redirects to `/dashboard/login` if not authenticated)
- **Default login**: `admin@mkshopbd.com` / `admin123`
- **Pages**:
  - Dashboard overview (stats)
  - Products (list, add, edit, delete)
  - Categories (list, add, delete)
  - Deals (list, add, edit, delete)
  - Blog (list, add, edit, delete)
  - Orders (list, view details)

### Dynamic Frontend
- **Shop** - Fetches products from `/api/products`
- **Product detail** - Fetches from `/api/products/[id]`
- **Deals** - Fetches from `/api/deals`
- **Deal detail** - Fetches from `/api/deals/[id]`
- **Featured products (home)** - Fetches from `/api/products`
- **Checkout** - Creates real orders via POST `/api/orders`

## Data Storage

Data is stored in `data/db.json`. You can edit this file directly or use the dashboard. **Note**: The JSON file is loaded in memory; for production, consider using a database (e.g., Prisma + SQLite/PostgreSQL).

## Environment Variables (optional)

Create `.env` in the project root:

```
ADMIN_EMAIL=admin@mkshopbd.com
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Run the Project

```bash
npm install
npm run dev
```

Then open:
- **Store**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/dashboard
- **Login**: admin@mkshopbd.com / admin123

## API Examples

### Get Products
```
GET /api/products
GET /api/products?category=Electronics
GET /api/products?search=wireless
```

### Create Product (POST)
```
POST /api/products
Content-Type: application/json
{ "name": "New Product", "price": 99.99, "category": "Electronics" }
```

### Create Order (from checkout)
```
POST /api/orders
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01712345678",
  "address": "123 Street",
  "district": "Dhaka",
  "zipCode": "1000",
  "country": "Bangladesh",
  "items": [{ "productId": "1", "name": "Product", "price": 99.99, "quantity": 1, "itemType": "product" }],
  "subtotal": 99.99,
  "shipping": 0,
  "total": 99.99,
  "paymentMethod": "bkash",
  "paymentInfo": "TXN123"
}
```

## Upgrading to Database

To use Prisma with SQLite/PostgreSQL instead of JSON:

1. Install: `npm install prisma @prisma/client`
2. Add `prisma/schema.prisma` and run `npx prisma migrate dev`
3. Replace `lib/db.ts` with Prisma client calls
4. Update API routes to use Prisma
