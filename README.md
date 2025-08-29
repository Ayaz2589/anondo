# Anondo - Next.js Authentication App

A modern Next.js application with Google OAuth authentication, built with TypeScript and structured backend using Next.js API routes.

## Features

- 🔐 **Google OAuth Authentication** - Secure authentication using NextAuth.js
- 🏗️ **Structured Backend** - Organized API routes with services and schemas
- 📝 **TypeScript Support** - Full type safety throughout the application
- ✅ **Schema Validation** - Input validation using Zod
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- 🔒 **Protected Routes** - Secure API endpoints with session management

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth.js API routes
│   │   └── users/                  # User management API routes
│   ├── auth/
│   │   ├── signin/                 # Custom sign-in page
│   │   └── error/                  # Authentication error page
│   ├── layout.tsx                  # Root layout with AuthProvider
│   └── page.tsx                    # Home page with authentication demo
├── components/
│   └── auth/
│       ├── SignInButton.tsx        # Authentication button component
│       └── UserProfile.tsx         # User profile display component
└── lib/
    ├── auth/
    │   ├── config.ts               # NextAuth.js configuration
    │   ├── auth-service.ts         # Authentication service layer
    │   └── providers.tsx           # Session provider wrapper
    └── schemas/
        └── auth.ts                 # Zod schemas and TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth credentials

### 1. Clone and Install

```bash
cd anondo
npm install
```

### 2. Set Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 3. Environment Configuration

Copy the example environment file and add your credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Google OAuth credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication

- `GET/POST /api/auth/*` - NextAuth.js authentication endpoints

### Users

- `GET /api/users` - Get all users (protected)
- `GET /api/users/[id]` - Get user by ID (protected)
- `PUT /api/users/[id]` - Update user (protected, own profile only)
- `DELETE /api/users/[id]` - Delete user (protected, own profile only)

## Authentication Flow

1. **Sign In**: Users click "Sign in with Google" button
2. **OAuth Redirect**: Redirected to Google OAuth consent screen
3. **Callback**: Google redirects back with authorization code
4. **User Creation**: NextAuth.js creates or updates user in our service
5. **Session**: JWT session token is created and stored
6. **Protected Access**: Users can access protected routes and API endpoints

## Backend Architecture

### Services Layer (`src/lib/auth/auth-service.ts`)

- `AuthService.createOrUpdateUser()` - Handle user creation/updates
- `AuthService.getUserByEmail()` - Retrieve user by email
- `AuthService.getUserById()` - Retrieve user by ID
- `AuthService.updateUser()` - Update user information
- `AuthService.deleteUser()` - Delete user account

### Schemas Layer (`src/lib/schemas/auth.ts`)

- Zod schemas for validation
- TypeScript type definitions
- Request/response interfaces

### API Routes Layer (`src/app/api/`)

- RESTful API endpoints
- Authentication middleware
- Error handling
- Request validation

## Security Features

- **JWT Sessions** - Secure session management
- **OAuth 2.0** - Industry-standard authentication
- **Protected Routes** - Server-side session validation
- **Input Validation** - Zod schema validation
- **CSRF Protection** - Built-in NextAuth.js protection

## Development

### Adding New API Routes

1. Create route file in `src/app/api/`
2. Add service methods in appropriate service file
3. Define schemas in `src/lib/schemas/`
4. Implement authentication checks

### Customizing Authentication

- Modify `src/lib/auth/config.ts` for NextAuth.js settings
- Update `src/lib/auth/auth-service.ts` for custom user logic
- Customize UI components in `src/components/auth/`

## Production Deployment

1. **Environment Variables**: Set production environment variables
2. **NEXTAUTH_SECRET**: Generate a secure secret for production
3. **Database**: Replace in-memory storage with a real database (Prisma + PostgreSQL recommended)
4. **OAuth URLs**: Update Google OAuth redirect URLs for production domain

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **NextAuth.js** - Authentication library
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation
- **Google OAuth 2.0** - Authentication provider

## License

MIT License - feel free to use this project as a starting point for your applications.
