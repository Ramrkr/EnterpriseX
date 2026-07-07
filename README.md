
  # Department Store Mobile App

This is a code bundle for Department Store Mobile App. The original project is available at https://www.figma.com/design/q3qqiKAVIO7XQ2ME5bWpf9/Department-Store-Mobile-App.

## Full-stack setup

### 1. Start PostgreSQL

If Docker is available on your machine:

```bash
docker compose up -d
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

The API will be available at http://localhost:5000/api.

### 3. Start the frontend

From the project root:

```bash
npm install
npm run dev
```

## API endpoints

- GET /api/health
- GET /api/products
- POST /api/products
- PUT /api/products/:id/restock
- GET /api/customers
- POST /api/customers
- PUT /api/customers/:id
- DELETE /api/customers/:id
- GET /api/orders
- POST /api/orders
- PUT /api/orders/:id
- DELETE /api/orders/:id
- PATCH /api/orders/:id/status
- GET /api/payments
- PUT /api/payments/:orderId
  "# EnterpriseX" 
