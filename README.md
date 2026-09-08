# Product MLM Platform

A full-stack product-based referral and commission platform built with the MERN stack.

The platform combines e-commerce functionality with a structured referral network, product-based commissions, user wallets, withdrawals, and notifications.

> **Important:** Commissions in this project are tied to qualifying product sales rather than recruitment alone.

---

## 🚀 Features

### Authentication & Users

- User registration
- User login
- JWT access tokens
- JWT refresh tokens
- Password hashing with bcrypt
- Role-based authorization
- USER and ADMIN roles
- User activation/deactivation
- Unique referral codes

### 🛍️ E-Commerce

- Product management
- Category management
- Product stock management
- Product images
- Shopping cart
- Checkout
- Order management
- Order status management
- Payment status tracking
- Product-based commission configuration

### 👥 Referral System

- Unique referral codes
- Referral links
- Direct referrals
- Referral statistics
- Sponsor/member relationships
- Multi-level genealogy

### 🌳 MLM Genealogy

The platform maintains a sponsor network.

Example:

```text
User A
│
├── User B
│   ├── User D
│   └── User E
│
└── User C
    └── User F
