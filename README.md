# 🏦 Loan Link — Smart Loan Management Platform

**Live Website:** https://loanlinkph.netlify.app/  
A full-featured **loan management system** where users can apply for loans, pay application fees using Stripe, and managers can publish, manage, approve, and track loans. Built for speed, security, and a smooth user experience.

---

## 🚀 Overview

**Loan Link** is a modern, scalable web application designed to simplify loan operations. Borrowers can apply for loans, track their application status, and pay loan fees securely through Stripe. Managers can publish new loans, approve borrower applications, and manage loan statuses through a clean dashboard.

---

## ✨ Features

### 👤 Borrower Features
- Create an account & login via Firebase Auth  
- Apply for available loan programs  
- View personal loan history  
- Pay loan application fee instantly using **Stripe Checkout**  
- Automatic loan status update after payment  
- Real-time dashboard updates  

### 👨‍💼 Loan Manager Features
- Publish new loan programs  
- View all borrower loan applications  
- Approve or reject loan applications  
- Mark loan as paid/unpaid  
- Manage users (Admin access)  

### 🔐 Security
- Protected routes using JWT & Firebase Admin  
- Role-based access control (RBAC):  
  - **User**  
  - **Manager**  
  - **Admin**  
- Secure APIs with HTTP-only cookies  
- Stripe secure payment integration  

---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- TanStack Query
- Firebase Authentication
- React Icons
- React Hot Toast
- Stripe.js

### **Backend**
- Node.js & Express  
- MongoDB & Mongoose  
- Firebase Admin SDK  
- Stripe Payments  
- JWT Authentication  
- CORS, dotenv  

### **Deployment**
- Frontend → Netlify  
- Backend → Render / Vercel / Railway  
- Database → MongoDB Atlas  

---

## 📦 Installation & Setup

### **Clone the repo**
```bash
git clone https://github.com/your-username/loan-link.git
cd loan-link
