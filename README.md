# LoanLink - Professional Loan Management System

A comprehensive full-stack loan management platform built with React, Node.js, Express, and MongoDB. LoanLink provides a secure, scalable solution for managing loan applications with role-based access control.

## 🚀 Features

### Core Functionality

- **Multi-Role System**: Admin, Manager, and Borrower roles with specific permissions
- **Loan Management**: Create, view, update, and delete loan options
- **Application Processing**: Complete loan application workflow with status tracking
- **Payment Integration**: Secure Stripe payment processing for application fees
- **Dashboard Analytics**: Real-time statistics and charts for all user roles
- **Profile Management**: Comprehensive user profile editing with image upload

### Security & Performance

- **JWT Authentication**: Secure Firebase-based authentication
- **Input Validation**: Comprehensive server-side validation with express-validator
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **Security Headers**: Helmet.js for security headers
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Error Handling**: Centralized error handling with proper logging

### User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode**: Complete dark/light theme support
- **Loading States**: Skeleton loaders and loading indicators
- **Error Boundaries**: Graceful error handling with recovery options
- **Toast Notifications**: User-friendly feedback system
- **Pagination**: Efficient data loading with pagination

## 🛠 Tech Stack

### Frontend

- **React 19** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **React Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization
- **Framer Motion** - Animations and transitions

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Firebase Admin** - Authentication and user management
- **Stripe** - Payment processing
- **Winston** - Logging
- **Helmet** - Security middleware
- **Express Validator** - Input validation

### DevOps & Testing

- **Vitest** - Frontend testing framework
- **Jest** - Backend testing framework
- **Supertest** - API testing
- **MongoDB Memory Server** - In-memory database for testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Firebase project with Authentication enabled
- Stripe account for payment processing

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/loanlink.git
cd loanlink
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Firebase (Base64 encoded service account key)
FB_SERVICE_KEY=your_base64_encoded_service_account_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Application
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5174

# Security
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:

```env
# API
VITE_API_URL=http://localhost:3000

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5174
- Backend API: http://localhost:3000

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Backend Tests

```bash
cd backend
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## 📁 Project Structure

```
loanlink/
├── backend/
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   ├── logs/            # Log files
│   └── index.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── providers/   # Context providers
│   │   ├── routes/      # Route definitions
│   │   ├── utilities/   # Utility functions
│   │   └── test/        # Test utilities
│   └── public/          # Static assets
└── README.md
```

## 🔐 Security Features

### Authentication & Authorization

- Firebase Authentication integration
- JWT token verification
- Role-based access control (RBAC)
- Protected routes and API endpoints

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Security headers (Helmet.js)

### Best Practices

- Environment variable management
- Secure password requirements
- Token expiration handling
- Error message sanitization
- Audit logging

## 📊 API Documentation

### Authentication Endpoints

- `POST /user` - Register/login user
- `GET /user/role` - Get user role
- `PUT /user/:email` - Update user profile

### Loan Management

- `GET /loans` - Get available loans (paginated)
- `POST /loans` - Create new loan (Admin only)
- `GET /loans/:id` - Get loan by ID
- `PUT /loans/:id` - Update loan (Admin only)
- `DELETE /loans/:id` - Delete loan (Admin only)

### Loan Applications

- `POST /apply-loans` - Submit loan application
- `GET /apply-loans/user/:email` - Get user's applications
- `PATCH /apply-loans/:id` - Update application status (Manager only)
- `DELETE /apply-loans/:id` - Cancel application

### Payment Processing

- `POST /create-checkout-session` - Create Stripe checkout session
- `PATCH /apply-loans/:id/pay-fee` - Record payment
- `GET /payment-details/:sessionId` - Get payment details

### Statistics

- `GET /admin-stats` - Admin dashboard statistics
- `GET /manager-stats` - Manager dashboard statistics
- `GET /borrower-stats` - Borrower dashboard statistics

## 🚀 Deployment

### Environment Setup

1. Set up production MongoDB cluster
2. Configure Firebase project for production
3. Set up Stripe webhook endpoints
4. Configure environment variables

### Frontend Deployment (Netlify/Vercel)

```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Backend Deployment (Railway/Render/Heroku)

```bash
# Set environment variables in your hosting platform
# Deploy using Git or Docker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- MongoDB for database services
- Tailwind CSS for styling framework
- React community for excellent libraries

## 📞 Support

For support, email support@loanlink.com or create an issue in the GitHub repository.

## 🔄 Changelog

### Version 1.0.0

- Initial release with core functionality
- Multi-role authentication system
- Loan management and application processing
- Payment integration with Stripe
- Comprehensive dashboard with analytics
- Mobile-responsive design
- Dark mode support

---

**Built with ❤️ by the LoanLink Team**
