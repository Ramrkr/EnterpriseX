# Agent Handoff: Department Store Mobile App

## Project overview
This repository contains a mobile-first department-store management application with a React + TypeScript frontend and an Express + PostgreSQL backend. The app is structured as a full-stack monorepo for managing inventory, customers, orders, payments, and sales reporting.

## Goal of the project
Provide a polished mobile-friendly experience for a trading/business workflow with two operating modes:
- Wholesale
- Retail

## Tech stack
### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn-style UI components
- MUI and Radix UI primitives
- React Query
- lucide-react, motion, recharts, react-dnd

### Backend
- Node.js
- Express
- PostgreSQL

### Dev tooling
- pnpm workspace
- Docker Compose for PostgreSQL

## Repository structure
- README.md — setup instructions and API overview
- docker-compose.yml — PostgreSQL container setup
- backend/ — Express API server
  - backend/index.js — REST API implementation
  - backend/db.js — DB connection, schema creation, and seed data
  - backend/package.json — backend scripts and dependencies
- frontend/ — React app
  - frontend/package.json — frontend scripts and dependencies
  - frontend/src/app/App.tsx — main app state machine and screen routing
  - frontend/src/app/components/ — models, types, utility helpers, and page components

## Main application flows
The app currently supports:
- Authentication screens (login/register)
- Business selection
- Inventory management
- Customer management
- Order creation and management
- Payment tracking
- Transactions and sales reporting
- Profile/dashboard screens

## Key files to know
- [frontend/src/app/App.tsx](frontend/src/app/App.tsx) — central screen-based app orchestration
- [frontend/src/app/components/models.ts](frontend/src/app/components/models.ts) — core domain types
- [frontend/src/app/components/types.ts](frontend/src/app/components/types.ts) — screen and enum types
- [frontend/src/app/components/loadAppData.ts](frontend/src/app/components/loadAppData.ts) — frontend data loading from backend
- [frontend/src/app/components/utility.ts](frontend/src/app/components/utility.ts) — API helper and base URL
- [backend/index.js](backend/index.js) — REST endpoints and business logic
- [backend/db.js](backend/db.js) — database schema initialization and seed data

## Backend API summary
Main endpoints:
- GET /api/health
- POST /api/register/new-user
- POST /api/log-in
- GET /api/traders
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

## Data model highlights
- Trader: id, name, company
- Product: id, traderId, company, name, sku, category, description, metric, unitsPerBox, landingPrice, mrp, stock
- Customer: id, shopName, customerName, gst, address, mobile
- Order: id, mode, traderId, customerId, customerName, shopName, status, items, total, date
- PaymentRecord: status, paymentMethod, amountPaid, isCredit

## Runtime expectations
- Frontend API base URL: http://localhost:5000/api
- Backend runs on port 5000 by default
- PostgreSQL should be available via Docker Compose

## Setup commands
From the repository root:
- Start PostgreSQL: docker compose up -d
- Start backend:
  - cd backend
  - npm install
  - npm run dev
- Start frontend:
  - cd frontend
  - npm install
  - npm run dev

## Notes for the next agent
- Preserve the existing screen-based architecture unless a refactor is explicitly requested.
- The app is already integrated between frontend and backend through HTTP.
- Authentication is partially implemented and may need further wiring.
- Prefer incremental feature work and keep the current UI style consistent.

## Copy-paste prompt
Analyze this repository and help me continue development on it. This is a mobile-first department-store management app with a React + TypeScript frontend and an Express + PostgreSQL backend. The main app orchestration lives in frontend/src/app/App.tsx, the backend API lives in backend/index.js, and the database setup and seed data live in backend/db.js. The app supports wholesale and retail modes, inventory management, customer management, order management, payments, transactions, sales reporting, and profile/dashboard flows. The frontend communicates with the backend at http://localhost:5000/api. Preserve the existing screen-based architecture unless a refactor is explicitly requested. Prefer incremental changes that fit the current structure and maintain the existing UI style.
