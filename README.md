# Employee Directory

A modern, full-stack employee management system built with React, Node.js, and MySQL. This monorepo contains both the frontend UI and backend API for managing employee data, departments, locations, and permissions.

## 🌐 Live Preview

**Live Application**: [https://www.employee-directory.online](https://www.employee-directory.online)

Experience the full application with all features including authentication, employee management, and permission-based access control.

## 🚀 Deployment

### **Current Deployment Architecture**

#### **Frontend Deployment**

- **Cloudflare**: DNS management and proxy
- **CloudFront**: CDN for S3 bucket
- **S3**: Static hosting bucket for the React application
- **Flow**: Cloudflare (Proxy) → CloudFront → S3 Bucket

#### **Backend Deployment**

- **EC2 Instance**: Ubuntu server running the Node.js application
- **PM2**: Process manager for production deployment
- **Nginx**: Reverse proxy
- **SSL**: HTTPS termination handled by Cloudflare and Let's Encrypt (certbot)

## 🚀 Features

### Frontend (React + TypeScript)

- **Modern UI**: Built with React 18, TypeScript, and PrimeReact components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Internationalization**: Multi-language support with i18next
- **State Management**: Zustand for lightweight state management
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: JWT-based authentication with refresh tokens
- **Permission System**: Permission-based access control (view, create, update, delete)
- **File Upload**: Profile photo upload with AWS S3 integration
- **Real-time Notifications**: Toast notifications for user feedback

### Backend (Node.js + Express)

- **RESTful API**: Express.js with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with refresh token rotation
- **File Storage**: AWS S3 integration for file uploads
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston for structured logging
- **Testing**: Comprehensive Jest test suite

## 🏗️ Architecture

```
employee-directory-monorepo/
├── api/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/ # API route handlers
│   │   ├── middleware/  # Authentication & validation
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   └── utils/       # Helper functions
│   ├── prisma/          # Database schema & migrations
│   └── tests/           # API tests
├── ui/                  # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Feature-based modules
│   │   ├── services/    # API client services
│   │   ├── stores/      # Zustand state stores
│   │   └── tests/       # Component tests
│   └── public/          # Static assets
└── schema.dbml          # Database schema documentation
```

## 📚 Documentation

- **API Documentation**: Interactive Swagger documentation available at `/docs` when the backend is running
- **Database Schema**: See `schema.dbml` for the complete database structure (can be opened in [dbdiagram.io](https://dbdiagram.io) for visual schema viewing)
- **Environment Setup**: Copy `env.example` files in both `api/` and `ui/` directories
- **Architecture Decisions**:
    - **Frontend**: `ui/ARCHITECTURE.md` - Documents frontend technology choices, patterns, and design decisions
    - **Backend**: `api/ARCHITECTURE.md` - Documents backend architecture, database design, and security decisions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 18.0.0)
- **npm** (>= 8.0.0)
- **MySQL** (>= 8.0)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-directory-monorepo
```

### 2. Install Dependencies

```bash
# Install all dependencies (monorepo + api + ui)
npm run install:all
```

### 3. Environment Configuration

#### Backend (API)

```bash
cd api
cp env.example .env
```

Edit `api/.env` with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/employee_directory"

# Server
PORT=5001
NODE_ENV=development
HOST=localhost

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-token-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=3600

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-employee-directory-bucket
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# CORS
CORS_ORIGIN=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (UI)

```bash
cd ui
cp env.example .env
```

Edit `ui/.env` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 5. Start Development Servers

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:5001/docs

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### Frontend Tests

```bash
cd ui
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
```

### Backend Tests

```bash
cd api
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
```

## 📦 Build

```bash
# Build both frontend and backend
npm run build:ui
npm run build:api
```

## 🗄️ Database Schema

The application uses a relational database with the following main entities:

- **Employee**: Core employee information and relationships
- **Department**: Organizational departments
- **Location**: Office locations
- **Permission**: System permissions
- **EmployeePermission**: Many-to-many relationship for role-based access
- **RefreshToken**: JWT refresh token management
- **Asset**: File upload management (profile photos, etc.)

See `schema.dbml` for the complete database schema.

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with:

- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Secure Routes**: Protected API endpoints and UI routes

### Permission-Based Access Control

The system implements permissions that control user actions:

- **View Permissions**: Users can only see data they're authorized to access
- **Create Permissions**: Users can only create records if they have the appropriate permissions
- **Update Permissions**: Users can only modify records if they have update permissions
- **Delete Permissions**: Users cannot delete records without explicit delete permissions

For example, an employee without delete permissions will not see delete buttons in the UI, and any attempt to delete through the API will be rejected.

**Business Rules:**

- **Reporting Manager Protection**: Employees who have other employees reporting to them cannot be deleted unless those employees are reassigned to another manager
- **Permission Enforcement**: Both UI and API levels enforce these restrictions to maintain data integrity

### Default Admin User

After seeding the database, you can log in with:

- **Email**: ceo@company.com
- **Password**: ceo123456

## 🌐 API Documentation

Once the backend is running, visit http://localhost:5001/docs for interactive API documentation powered by Swagger.

## 🎨 UI Components

The frontend uses PrimeReact components with a custom theme built on Tailwind CSS. Key features include:

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: Built with accessibility in mind using PrimeReact components
- **Internationalization**: Multi-language support

## 👨‍💻 Author

**AbbassJaber**
