# 🍔 MenuLink — Direct Food Delivery & Restaurant Platform

> **Empowering Restaurants with 0% Commission Direct Online Ordering, WhatsApp AI Automation, and Real-Time Kitchen Operations.**

---

> [!NOTE]
> ### 💼 Investor Pitch & Demonstration Prototype
> **Notice:** This repository is an MVP / functional demo project designed to pitch and showcase to **investors for funding**. It demonstrates the viability, technical architecture, and end-to-end user workflows of replacing high-commission third-party delivery aggregators with direct-to-consumer digital ordering and conversational WhatsApp commerce.

---

## 📌 Table of Contents
- [Executive Summary](#-executive-summary)
- [The Problem vs. The MenuLink Solution](#-the-problem-vs-the-menulink-solution)
- [Key Platform Features](#-key-platform-features)
- [Investor Value Proposition](#-investor-value-proposition)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Database Seeding](#2-database-seeding)
  - [Frontend Setup](#3-frontend-setup)
- [API Endpoints](#-api-endpoints)
- [Default Admin Credentials](#-default-admin-credentials)
- [Deployment Guide](#-deployment-guide)
- [License](#-license)

---

## 🌟 Executive Summary

**MenuLink** is a direct-to-consumer ordering infrastructure built for independent restaurants, home chefs, cloud kitchens, and franchise chains. 

Traditional delivery aggregators (e.g., Swiggy, Zomato, UberEats) charge restaurant owners between **25% and 35% commission** on every order, capture the customer data, and delay payouts by 7–15 days. MenuLink levels the playing field by providing food businesses with an instant digital storefront, conversational WhatsApp AI ordering, direct UPI payouts, and a centralized operations dashboard with **0% commission fees**.

---

## ⚖️ The Problem vs. The MenuLink Solution

| Core Dimension | Traditional Delivery Aggregators | MenuLink Direct Platform |
| :--- | :--- | :--- |
| **Commission Rate** | 25% – 35% cut taken from every sale | **0% Commission** (100% revenue retained) |
| **Payout Timing** | 7 – 15 business days payout cycle | **Instant UPI direct bank deposits** |
| **Customer Data Ownership** | Hidden / Masked customer contacts | **100% Owned by the restaurant** for remarketing |
| **Ordering Channel** | Third-party app downloads required | **Web link + Native WhatsApp ordering** |
| **Brand Identity** | Listed among competitors on aggregator app | **Dedicated, branded ordering experience** |

---

## 🔥 Key Platform Features

### 1. 📱 WhatsApp Business AI Chat Ordering
- **Friction-Free Ordering**: Customers can discover outlets, browse menus, customize dishes, and order directly inside a native WhatsApp-style chat interface without downloading any mobile app.
- **Location-Based Discovery**: Automatically suggests nearby outlets based on delivery location (e.g., Hyderabad, Hitec City, Jubilee Hills, Bengaluru).
- **Interactive In-Chat Catalog**: Dynamic restaurant cards and dish selection buttons directly in the chat stream.
- **Direct UPI Instant Payments**: Automated payment links with real-time transaction verification and downloadable 0% commission digital receipts.

### 2. 👨‍🍳 Kitchen Admin Portal & Order Pipeline
- **Real-Time Kanban Management**: Kitchen operators can manage incoming orders through structured status states: `Received` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`.
- **Live Revenue & Sales Analytics**: Real-time tracking of gross sales volume, commission saved, active order count, and payment settlements.
- **Instant Digital Receipts**: Print-ready and downloadable order invoices with complete itemized breakdowns.
- **Manual Order Entry**: Ability for restaurant staff to input phone or walk-in orders into the centralized pipeline.

### 3. 🍲 Menu & Real-Time Stock Management
- **Instant Availability Toggling**: One-click toggle to disable out-of-stock items across customer menus instantly.
- **Rich Menu Customization**: Organize dishes by category (Main Course, Biryani, Tiffins, Beverages), update prices, add descriptions, and adjust portions on the fly.
- **Multi-Location Menu Sync**: Support for single outlets as well as multi-branch chain operations.

### 4. 🏬 Restaurant Partner Onboarding & Management
- **Self-Serve Partner Registration**: Seamless 15-minute onboarding flow capturing business details, contact information, cuisine categories, and UPI credentials.
- **Multi-Outlet Administration**: Platform admins can view, approve, manage, and monitor all onboarded partner kitchens from one central view.

### 5. 📊 Interactive Aggregator Cost & Savings Visualizer
- **Dynamic ROI Calculator**: Interactive revenue sliders that allow prospective restaurant partners and investors to visualize monthly and annual savings by eliminating aggregator fees.
- **Side-by-Side Comparison Matrix**: Clear metrics highlighting direct payment speed, customer relationship ownership, and fee structures.

### 6. 🔌 Ecosystem Integration Ready
- **POS & Billing Systems**: Architecture designed to connect with industry-standard POS software (Petpooja, UrbanPiper, POSist, Toast, Square).
- **Third-Party Logistics**: Dispatch integration ready for on-demand hyper-local courier fleets (Shadowfax, LoadShare, Dunzo, Porter).

---

## 💼 Investor Value Proposition

- **Massive TAM**: The food and beverage direct-ordering and software market is growing rapidly as restaurant margins are squeezed by aggregator monopolies.
- **Compelling Unit Economics**: Predictable SaaS subscription / flat micro-fee pricing model compared to unsustainable high-percentage commission models.
- **Viral Growth Loops**: Every restaurant that shares its MenuLink digital menu link brings organic, repeat customers without costly customer acquisition spend.
- **High Retention & Stickiness**: Once a restaurant integrates its menu, WhatsApp audience, and kitchen printer workflow into MenuLink, switching costs are high.

---

## 🛠 Technology Stack

### Frontend Client
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern responsive CSS system (custom palette, CSS Variables, Flexbox & Grid)
- **State & Routing**: Client-side history & hash routing (`#admin`, `/admin`) with persistent session storage

### Backend REST API
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **Authentication & Security**: JWT (JSON Web Tokens), `bcryptjs` password hashing, and CORS protection
- **AI Chat Service**: Integrated webhook adapter for conversational ordering responses

### Deployment Ready
- **Frontend**: Configured for deployment on **Netlify** or **Vercel** (`netlify.toml`, `public/_redirects`, `vercel.json`).
- **Backend**: Configured for deployment on **Render**, **Railway**, or **AWS** (`render.yaml`).

---

## 📁 Project Architecture

```
food-delivery/
├── backend/                        # Express.js REST API Server
│   ├── config/                     # Database connection & Atlas fallback (db.js)
│   ├── controllers/                # Business logic (auth, menu, orders, payments, restaurants)
│   ├── models/                     # Mongoose Schemas (Admin, Menu, Order, Payment, Restaurant)
│   ├── routes/                     # REST API route endpoints
│   ├── seed.js                     # Mock database seed script for demo data
│   ├── server.js                   # Express application entry point
│   ├── package.json                # Backend dependencies
│   └── .env.example                # Sample environment configuration
├── public/                         # Static assets & routing rewrites
│   └── _redirects                  # Netlify SPA redirect rules
├── src/                            # React Application Source
│   ├── components/                 # UI components
│   │   ├── AdminLogin.jsx          # Admin authentication with masked password
│   │   ├── AdminPortal.jsx         # Kitchen Kanban & management dashboard
│   │   ├── AggregatorCostVisualizer.jsx
│   │   ├── BusinessTypes.jsx       # Outlets supported (Cloud Kitchen, Bakery, etc.)
│   │   ├── ChatDemoSection.jsx     # WhatsApp ordering showcase container
│   │   ├── ChatWidget.jsx          # Live WhatsApp conversational order engine
│   │   ├── ComparisonTable.jsx     # Side-by-side aggregator vs MenuLink table
│   │   ├── FinalCTA.jsx            # Conversion banner
│   │   ├── FloatingQuickWidget.jsx # Recent real-time social proof toast
│   │   ├── Footer.jsx              # Footer links and copyright
│   │   ├── Hero.jsx                # Landing page hero banner
│   │   ├── HeroVideoMockup.jsx     # Interactive digital ordering mockup
│   │   ├── HowItWorks.jsx          # 4-step ordering guide
│   │   ├── IntegrationsMarquee.jsx # POS & logistics partner showcase
│   │   ├── LogoMarquee.jsx         # Trusted restaurant brand marquee
│   │   ├── Navbar.jsx              # Navigation header
│   │   ├── RegistrationSection.jsx # Restaurant onboarding registration form
│   │   ├── SavingsCalculator.jsx   # Live savings slider
│   │   ├── StatsBar.jsx            # Platform impact counters
│   │   ├── StickyStackingFeatures.jsx
│   │   └── ValuePropPills.jsx      # Feature value pills
│   ├── services/                   # Unified API adapter layer
│   ├── styles/                     # Modular domain stylesheets
│   ├── App.jsx                     # Top-level application root & route router
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Vite React DOM entry point
├── netlify.toml                    # Netlify production build configuration
├── render.yaml                     # Render deployment service definition
├── vercel.json                     # Vercel deployment routes
├── vite.config.js                  # Vite bundler configuration
└── package.json                    # Root scripts and frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster connection URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/menulink
   JWT_SECRET=menulink_super_secret_jwt_key_2026
   ```

---

### 2. Database Seeding

Populate your database with demo restaurants, menu items, orders, and payment records:

```bash
node seed.js
```

Start the backend server:
```bash
npm run dev
# Or production mode:
npm start
```
- **Backend API URL**: `http://localhost:5000`
- **Healthcheck Endpoint**: `http://localhost:5000/api/health`

---

### 3. Frontend Setup

1. Open a second terminal in the project root:
   ```bash
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🌐 API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `/api/health` | `GET` | Health status and API service version |
| **Auth** | `/api/admin/login` | `POST` | Authenticate admin credentials and generate JWT token |
| **Restaurants** | `/api/restaurants` | `GET` / `POST` | List all restaurants or onboard a new partner outlet |
| **Restaurants** | `/api/restaurants/:id/status` | `PATCH` | Update restaurant status (`Active` / `Inactive`) |
| **Menu** | `/api/menu` | `GET` / `POST` | Fetch catalog dishes or add a new menu item |
| **Menu** | `/api/menu/:id` | `PUT` / `DELETE` | Update price/details or delete menu item |
| **Menu** | `/api/menu/:id/stock` | `PATCH` | Toggle availability status (`inStock` true/false) |
| **Orders** | `/api/orders` | `GET` / `POST` | Fetch order pipeline or submit a new customer order |
| **Orders** | `/api/orders/:id/status` | `PATCH` | Update kitchen status (`Received`, `Preparing`, `Delivered`) |
| **Payments** | `/api/payments` | `GET` | Fetch all payment transaction records |
| **Payments** | `/api/payments/verify` | `POST` | Verify instant UPI transaction reference |

---

## 🔑 Default Admin Credentials

To access the live Admin Management Dashboard:
- **Route**: Navigate to `/#admin` or `/admin`
- **Email / Username**: `admin@menulink.in` or `admin`
- **Password**: `12345` (or `adminpassword123`)

---

## ☁️ Deployment Guide

### Frontend Deployment (Netlify)
1. Link your GitHub repository to Netlify.
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Netlify automatically consumes `netlify.toml` and `public/_redirects` to handle client-side routing.

### Backend Deployment (Render)
1. Create a new **Web Service** on Render and connect this repository.
2. Build Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: Secure encryption key
   - `PORT`: `5000`

---

## 📄 License

This demo project is distributed under the **MIT License**.

---

<p align="center">
  <b>MenuLink</b> — Direct Online Ordering & WhatsApp Commerce Infrastructure 🚀🍕
</p>
