# 🏦 Loan Link — Smart Loan Management Platform

**Live Website:** https://loanlinkph.netlify.app/

A full-featured **loan management system** where users can apply for loans, pay application fees using Stripe, and managers and admins can publish, manage, approve, and track loans. Built with scalability, security, and performance in mind.

---

## 🚀 Overview

**Loan Link** is a modern MERN-stack web application designed to simplify digital loan operations. Borrowers can easily apply for loans, track application status, and make secure payments. Managers handle loan publishing and approvals, while admins maintain full control over users, roles, and platform visibility.

---

## ✨ Features

### 👤 Borrower Features
- User registration & login using **Firebase Authentication**
- Apply for available loan programs
- View personal loan application history
- Pay loan application fees securely via **Stripe Checkout**
- Automatic loan status updates after payment
- Real-time dashboard updates

---

### 👨‍💼 Loan Manager Features
- Publish and manage loan programs
- View all borrower loan applications
- Approve or reject loan requests
- Mark loans as paid or unpaid
- Manage loan statuses from a dedicated dashboard

---

### 🛡️ Admin Features
Admins have complete system-level access and platform control.

#### 👑 User & Role Management
- View all registered users
- Change user roles:
  - **User → Manager**
  - **Manager → Admin**
- Suspend or activate any user
- Instantly restrict suspended users from accessing the platform

#### 🏠 Homepage Loan Control
- Choose which loan programs appear on the **homepage**
- Show or hide specific loans from public view
- Ensure only approved and active loans are visible to borrowers

#### 📊 Application & Platform Insights
- View total number of loan applications submitted
- Track application status:
  - Pending
  - Approved
  - Rejected
- Monitor platform activity in real time

---

## 🔐 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| **User (Borrower)** | Apply for loans, pay fees, view loan history |
| **Manager** | Publish loans, manage and approve applications |
| **Admin** | Full system control: users, roles, suspension, homepage loans, analytics |

---

## 🔒 Security Features
- JWT-based protected routes
- Firebase Admin SDK for role verification
- Role-based API authorization
- HTTP-only cookies for secure sessions
- Stripe-secured payment processing
- Suspended user access blocking

---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- TanStack Query
- Firebase Authentication
- Stripe.js
- React Icons
- React Hot Toast

### **Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- Firebase Admin SDK
- Stripe API
- JWT Authentication
- dotenv, CORS

---

## 🌍 Deployment
- **Frontend:** Netlify  
- **Backend:** Render / Vercel / Railway  
- **Database:** MongoDB Atlas  

---

## 📦 Installation & Setup

### Clone the repository
```bash
git clone https://github.com/your-username/loan-link.git
cd loan-link
