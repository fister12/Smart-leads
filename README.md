# Smart Leads Dashboard - Complete B2B SaaS Application

## Overview
Smart Leads Dashboard is a full-stack B2B SaaS application built with TypeScript, MERN stack (MongoDB, Express, React, Node.js), and Docker. It provides a centralized platform for managing sales leads with role-based access control, advanced filtering, searching, pagination, and CSV export functionality.

## Features

### Authentication & Security
- JWT-based authentication with 15-minute access tokens and 7-day refresh tokens
- Password hashing with bcrypt (cost factor 12)
- Secure httpOnly cookies for refresh token storage
- Role-Based Access Control (RBAC) for Admin and Sales User roles

### Leads Management
- Create, read, update, and delete leads
- Advanced filtering by status, source, and custom search
- Full-text search across lead names and emails
- Backend-driven pagination (default 10 records, max 100)
- CSV export with RBAC-scoped data
- Compound query optimization with database indexes

### User Experience
- Responsive design (mobile, tablet, desktop)
- Dark mode support with localStorage persistence
- Form validation with React Hook Form and Zod
- Debounced search (350ms delay)
- Real-time error messages and toast notifications
- Accessible UI with WCAG 2.1 AA compliance
- Tailwind CSS styling with custom theme

## Tech Stack

### Backend
- Node.js 20 (LTS)
- Express.js
- MongoDB with Mongoose ODM
- TypeScript (strict mode)
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation
- Morgan for logging
- Helmet for security headers
- CORS with origin whitelist
- Express rate limiting

### Frontend
- React 18.2
- Vite build tool
- TypeScript (strict mode)
- React Router for navigation
- React Hook Form for form management
- Zod for schema validation
- Zustand for state management
- Axios for HTTP client
- Tailwind CSS for styling
- Dark mode support

### DevOps
- Docker with multi-stage builds
- Docker Compose orchestration
- MongoDB 7.0 container
- Nginx for production frontend serving

## Project Structure

```
ServiceHive/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   └── Lead.model.ts
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   └── lead.types.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validators.ts
│   │   │   └── leads/
│   │   │       ├── lead.routes.ts
│   │   │       ├── lead.controller.ts
│   │   │       ├── lead.service.ts
│   │   │       ├── lead.repository.ts
│   │   │       └── lead.validators.ts
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   ├── apiResponse.ts
│   │   │   ├── asyncHandler.ts
│   │   │   └── csvExporter.ts
│   │   └── app.ts
│   ├── Dockerfile
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   ├── auth.api.ts
│   │   │   └── leads.api.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Table.tsx
│   │   │   ├── leads/
│   │   │   │   ├── LeadCard.tsx
│   │   │   │   ├── LeadForm.tsx
│   │   │   │   ├── LeadFilters.tsx
│   │   │   │   └── LeadTable.tsx
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── LeadsPage.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── leadsStore.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   └── lead.types.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLeads.ts
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   └── formatDate.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.cjs
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ and npm (for local development)

### Installation

1. Clone the repository:
```bash
cd ServiceHive
```

2. Copy environment files:
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Update environment variables:
```bash
# .env
JWT_SECRET=your_secure_random_string_here
JWT_REFRESH_SECRET=your_secure_random_string_here
```

### Running with Docker Compose

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Local Development (without Docker)

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Leads
- `GET /api/leads` - List leads (with filters, search, pagination)
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead details
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (admin only)
- `GET /api/leads/export/csv` - Export filtered leads as CSV

## Database Schema

### User Collection
- `_id`: ObjectId
- `name`: String (2-80 chars)
- `email`: String (unique, indexed)
- `password`: String (bcrypt hash)
- `role`: Enum ('admin' | 'salesUser')
- `refreshToken`: String | null
- `createdAt`, `updatedAt`: Timestamps

### Lead Collection
- `_id`: ObjectId
- `name`: String (2-100 chars, letters/spaces only)
- `email`: String (unique, indexed)
- `phone`: String (optional, E.164 format)
- `status`: Enum ('new' | 'contacted' | 'qualified' | 'lost')
- `source`: Enum ('website' | 'instagram' | 'referral')
- `notes`: String (optional, max 500 chars)
- `assignedTo`: ObjectId ref to User (optional)
- `createdBy`: ObjectId ref to User (auto-populated)
- `createdAt`, `updatedAt`: Timestamps

### Indexes
- User: `{ email: 1 }` (unique)
- Lead: `{ status: 1, source: 1, createdAt: -1 }`
- Lead: `{ email: 1 }` (unique)
- Lead: `{ createdBy: 1 }`
- Lead: `{ name: 'text', email: 'text' }`

## Role-Based Access Control

### Admin
- Full system access
- Can create, view, edit, delete any lead
- Can manage system users
- Can export all data
- Can assign leads to any sales user

### Sales User
- Scope-restricted access
- Can create leads
- Can view, update, export only their assigned leads
- Cannot delete leads
- Cannot access user management
- Returns 403 Forbidden on unauthorized access

## Form Validation

### Client-side (React Hook Form + Zod)
- Real-time validation on blur and submit
- Inline error messages
- Symmetric with server-side validation

### Server-side (express-validator)
- Input sanitization
- Type checking
- Business logic validation
- Returns structured error responses

## Error Handling

All API errors return a consistent structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Enter a valid email address"
    }
  ]
}
```

HTTP Status Codes:
- `200` - OK
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Security Features

- **Helmet.js** - Security headers (CSP, HSTS, X-Frame-Options)
- **CORS** - Origin whitelist enforcement
- **Rate Limiting** - Global (100/15min) and auth-specific (5/min)
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing (cost factor 12)
- **Input Validation** - express-validator on server, Zod on client
- **SQL Injection Prevention** - MongoDB prepared statements via Mongoose
- **XSS Prevention** - React auto-escaping + Content Security Policy
- **CSRF Protection** - Origin-based CORS validation

## Performance Optimizations

- **Database Indexes** - Compound indexes for common queries
- **Pagination** - Backend-driven with 10-100 record limits
- **Text Search** - MongoDB text indexes for full-text search
- **Debouncing** - 350ms debounce on search input
- **Lazy Loading** - React components with code splitting
- **Caching** - HTTP cache headers for static assets
- **CDN Ready** - Nginx static file caching headers

## Development

### Adding a New Feature

1. Create types in `src/types/`
2. Create model in `src/models/` (backend)
3. Create validators in module
4. Create repository/service layer
5. Create controller with handlers
6. Create routes
7. Create API client (frontend)
8. Create store/hooks (frontend)
9. Create components (frontend)
10. Create pages (frontend)

### Code Style
- TypeScript with strict mode enabled
- Consistent naming conventions
- Modular architecture
- DRY principles
- Separation of concerns

## Troubleshooting

### MongoDB Connection Issues
```bash
docker-compose logs mongo
```

### API Port Already in Use
Change PORT in .env or docker-compose.yml

### Frontend Cannot Connect to API
Check VITE_API_URL in client/.env

### CORS Errors
Update CLIENT_URL in server/.env to match frontend URL

## License
MIT

## Support
For issues and feature requests, please create an issue in the repository.
