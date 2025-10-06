# School Payment and Dashboard Application

A full-stack microservice for managing school payments and transactions with integrated payment gateway support (Edviron Payment API).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schemas](#database-schemas)
- [Postman Collection](#postman-collection)
- [Project Structure](#project-structure)

## ✨ Features

### Backend
- RESTful API built with NestJS
- MongoDB Atlas integration
- JWT authentication and authorization
- Payment gateway integration (Edviron)
- Webhook handling for payment status updates
- Transaction aggregation and filtering
- Pagination, sorting, and search functionality
- Comprehensive error handling and logging

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Protected routes with JWT authentication
- Real-time transaction dashboard
- Payment link generation
- Transaction filtering and search
- Material Design elevation effects
- Responsive design

## 🛠 Tech Stack

**Backend:**
- Node.js
- NestJS
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Axios for HTTP requests
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (icons)
- date-fns

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## 🚀 Installation

### Backend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd school-payment-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend root:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Configuration](#environment-configuration))

5. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure frontend environment variables:
```env
VITE_API_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Environment Configuration

### Backend `.env`

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/school-payments

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Payment API
PAYMENT_API_URL=https://dev-vanilla.edviron.com/erp
PAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0
PG_KEY=edvtest01
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Application
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

### 🔑 Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 💳 Order/Payment Endpoints

#### Create Payment
```http
POST /orders/create-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "school_id": "65b0e6293e9f76a9694d84b4",
  "trustee_id": "65b0e552dd31950a9b41c5ba",
  "amount": 1000,
  "student_info": {
    "name": "John Doe",
    "id": "STU001",
    "email": "student@example.com"
  },
  "gateway_name": "PhonePe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment link generated successfully",
  "data": {
    "custom_order_id": "ORD_1234567890_abc123",
    "collect_request_id": "68e2f648154d1bce65b6adbc",
    "payment_url": "https://payments.cashfree.com/...",
    "order_id": "mongo_object_id"
  }
}
```

---

### 🔔 Webhook Endpoints

#### Webhook Handler (No Auth Required)
```http
POST /webhooks
Content-Type: application/json

{
  "status": 200,
  "order_info": {
    "order_id": "68e2f648154d1bce65b6adbc",
    "order_amount": 1000,
    "transaction_amount": 1000,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ybl",
    "Payment_message": "payment success",
    "payment_time": "2025-01-06T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "order_id": "68e2f648154d1bce65b6adbc",
    "status": "success"
  }
}
```

#### Get Webhook Logs
```http
GET /webhooks/logs?page=1&limit=20
Authorization: Bearer <token>
```

---

### 📊 Transaction Endpoints

#### Get All Transactions
```http
GET /transactions?page=1&limit=10&status=success&sort=createdAt&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (success, pending, failed, cancelled)
- `school_id` (optional): Filter by school ID
- `search` (optional): Search by order ID, collect ID, student name/email
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)
- `sort` (optional): Sort field (createdAt, order_amount, payment_time)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "mongo_id",
      "collect_id": "68e2f648154d1bce65b6adbc",
      "school_id": "65b0e6293e9f76a9694d84b4",
      "custom_order_id": "ORD_1234567890_abc123",
      "gateway_name": "PhonePe",
      "student_info": {
        "name": "John Doe",
        "id": "STU001",
        "email": "student@example.com"
      },
      "order_amount": 1000,
      "transaction_amount": 1000,
      "status": "success",
      "payment_mode": "upi",
      "payment_details": "success@ybl",
      "bank_reference": "YESBNK222",
      "payment_message": "payment success",
      "payment_time": "2025-01-06T08:14:21.945Z",
      "error_message": "NA",
      "createdAt": "2025-01-06T08:10:00.000Z",
      "updatedAt": "2025-01-06T08:14:21.945Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Get Transactions by School
```http
GET /transactions/school/:schoolId?page=1&limit=10
Authorization: Bearer <token>
```

**Response:** Same as Get All Transactions

#### Check Transaction Status
```http
GET /transactions/status/:custom_order_id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "collect_id": "68e2f648154d1bce65b6adbc",
    "custom_order_id": "ORD_1234567890_abc123",
    "status": "success",
    "order_amount": 1000,
    "transaction_amount": 1000,
    "payment_mode": "upi",
    "payment_time": "2025-01-06T08:14:21.945Z"
  }
}
```

#### Check Payment Status from API
```http
GET /transactions/check-payment/:collectRequestId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "SUCCESS",
    "amount": 1000,
    "details": {
      "payment_methods": null
    },
    "jwt": "token"
  }
}
```

---

## 🗄 Database Schemas

### Order Schema
```javascript
{
  _id: ObjectId,
  school_id: String,
  trustee_id: String,
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: String,
  custom_order_id: String (unique),
  collect_id: String (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### OrderStatus Schema
```javascript
{
  _id: ObjectId,
  collect_id: String (indexed, references Order),
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String (default: 'pending'),
  error_message: String,
  payment_time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### WebhookLog Schema
```javascript
{
  _id: ObjectId,
  payload: Object,
  status: Number,
  order_id: String,
  processed: Boolean,
  error: String,
  ip_address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📮 Postman Collection

### Import Instructions

1. Open Postman
2. Click "Import" button
3. Select "Raw text" tab
4. Paste the JSON below
5. Click "Import"

### Collection JSON

```json
{
  "info": {
    "name": "School Payment System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"Test User\"\n}"
            },
            "url": "{{base_url}}/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": "{{base_url}}/auth/login"
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Create Payment",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"},
              {"key": "Authorization", "value": "Bearer {{token}}"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"school_id\": \"65b0e6293e9f76a9694d84b4\",\n  \"trustee_id\": \"65b0e552dd31950a9b41c5ba\",\n  \"amount\": 1000,\n  \"student_info\": {\n    \"name\": \"John Doe\",\n    \"id\": \"STU001\",\n    \"email\": \"student@example.com\"\n  },\n  \"gateway_name\": \"PhonePe\"\n}"
            },
            "url": "{{base_url}}/orders/create-payment"
          }
        }
      ]
    },
    {
      "name": "Webhooks",
      "item": [
        {
          "name": "Webhook Handler",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": 200,\n  \"order_info\": {\n    \"order_id\": \"68e2f648154d1bce65b6adbc\",\n    \"order_amount\": 1000,\n    \"transaction_amount\": 1000,\n    \"gateway\": \"PhonePe\",\n    \"bank_reference\": \"YESBNK222\",\n    \"status\": \"success\",\n    \"payment_mode\": \"upi\",\n    \"payemnt_details\": \"success@ybl\",\n    \"Payment_message\": \"payment success\",\n    \"payment_time\": \"2025-01-06T08:14:21.945+00:00\",\n    \"error_message\": \"NA\"\n  }\n}"
            },
            "url": "{{base_url}}/webhooks"
          }
        },
        {
          "name": "Get Webhook Logs",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{base_url}}/webhooks/logs?page=1&limit=20",
              "host": ["{{base_url}}"],
              "path": ["webhooks", "logs"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "20"}
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Get All Transactions",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{base_url}}/transactions?page=1&limit=10&status=success",
              "host": ["{{base_url}}"],
              "path": ["transactions"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"},
                {"key": "status", "value": "success"}
              ]
            }
          }
        },
        {
          "name": "Get Transactions by School",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "{{base_url}}/transactions/school/65b0e6293e9f76a9694d84b4"
          }
        },
        {
          "name": "Check Transaction Status",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "{{base_url}}/transactions/status/ORD_1234567890_abc123"
          }
        }
      ]
    }
  ]
}
```

---

## 📁 Project Structure

```
school-payment-system/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── jwt/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── orders/
│   │   │   ├── dto/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.module.ts
│   │   │   └── orders.service.ts
│   │   ├── transactions/
│   │   │   ├── dto/
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.module.ts
│   │   │   └── transactions.service.ts
│   │   ├── webhooks/
│   │   │   ├── dto/
│   │   │   ├── webhooks.controller.ts
│   │   │   ├── webhooks.module.ts
│   │   │   └── webhooks.service.ts
│   │   ├── schemas/
│   │   │   ├── order.schema.ts
│   │   │   ├── order-status.schema.ts
│   │   │   ├── webhook-log.schema.ts
│   │   │   └── user.schema.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── CreatePayment.jsx
│   │   │   ├── PaymentCallback.jsx
│   │   │   └── TransactionStatus.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🧪 Testing

### Test Payment Flow

1. Register/Login to get JWT token
2. Create a payment using the Create Payment endpoint
3. Open the payment URL in browser
4. Complete payment using Cashfree sandbox credentials:
   - **Card:** 4111 1111 1111 1111, CVV: 123, Any future date
   - **Netbanking:** Select any bank, use success/failure options
5. User is redirected to `/payment-callback` with status
6. Frontend automatically calls webhook endpoint
7. Check transaction status in the transactions list

### Webhook Testing with Postman

1. Create a payment and note the `collect_request_id`
2. Use the Webhook Handler endpoint in Postman
3. Replace `order_id` with your `collect_request_id`
4. Send the request
5. Verify status updated in database

---

## 🔒 Security Best Practices

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable CORS only for trusted domains
- Implement rate limiting for public endpoints
- Use HTTPS in production
- Validate and sanitize all inputs
- Keep dependencies updated

---

## 🚢 Deployment

### Backend (Heroku/Railway)

1. Set environment variables in platform dashboard
2. Ensure MongoDB Atlas allows connections from deployment IP
3. Deploy from Git repository

### Frontend (Vercel/Netlify)

1. Set `VITE_API_URL` to production backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 📝 License

MIT

---

## 👥 Contact

For issues or questions, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- Edviron Payment API
- NestJS Framework
- React Team
- Tailwind CSS
