# Authentication with Node.js + Express

A TypeScript-based authentication system built with Express and Prisma, featuring secure user authentication, JWT-based session management, and email verification.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Email verification using nodemailer
- Rate limiting with express-rate-limit
- Secure HTTP headers with helmet
- Input validation with zod
- Logging with winston and morgan
- Prisma ORM for database operations
- TypeScript for type-safe development
- ESLint for code linting and formatting
- Redis for caching

## Prerequisites

- Node.js (v22.x or higher)
- npm (v10.x or higher)
- PostgreSQL (or other Prisma-supported database)
- Redis (optional, for caching)
- SMTP server for email verification (e.g., Gmail, SendGrid)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd express-authentication
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Run database migrations:

   ```bash
   npm run dev:migrate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Environment Variables

To configure the application, you need to create a `.env.development` file in the project root. Below are two methods to set it up:

#### Option 1: Copy from `.env.example`

1. **Create a `.env.development` file** in the project root:

   ```bash
   cp .env.example .env.development
   ```

#### Option 2: Use the Setup Script

2. **Run the setup script** to automatically generate `.env.development` and `.env.production` from `.env.example`

   ```bash
   npm run setup-env
   ```

#### Configuring Environment Variables

**Edit `.env.development`** with your configuration. All values **must** be enclosed in double quotes (`"`) for consistency:

```env
PORT="3000"
NODE_ENV="development"
BASE_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
DATABASE_URL="postgresql://user_postgres:pass_postgres@localhost:5432/express_auth_test?schema=public"
ACCESS_TOKEN_KEY="ACCESS_TOKEN_KEY"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_KEY="REFRESH_TOKEN_KEY"
REFRESH_TOKEN_EXPIRES_IN="7d"
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USERNAME="maddison53@ethereal.email"
SMTP_PASSWORD="jn7jnAPss4f63QBp6D"
```

**Note**: Ensure `.env.development` is listed in `.gitignore` to keep it out of version control.

## Docker Compose Setup

This project is containerized and can be run easily with Docker Compose. All services (application, database, and Redis) will be automatically configured and started.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd express-authentication
   ```

2. **Configure environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env.development

   ```

3. **Start all services**

   ```bash
   docker-compose up --build -d
   ```

   The application will be available at `http://localhost:3000`

### Stopping the Container

```bash
docker-compose down --volumes
```

### What Docker Compose Does

When you run `docker-compose up`, it will:

1. **Build the application image** from the Dockerfile
2. **Start PostgreSQL database** (postgres:latest)
3. **Start Redis cache** (redis:latest)
4. **Wait for services** to be ready
5. **Run database migrations** automatically
6. **Start the Express application**

## Services Overview

| Service      | Image                 | Port | Purpose                     |
| ------------ | --------------------- | ---- | --------------------------- |
| **app**      | Built from Dockerfile | 3000 | Express.js API application  |
| **postgres** | postgres:latest       | 5432 | PostgreSQL database         |
| **redis**    | redis:latest          | 6379 | Redis cache & session store |

## Scripts

- `npm start`: Run the application in production mode.
- `npm run dev`: Run the application in development mode with live reload.
- `npm run build`: Build the TypeScript code for production.
- `npm run clean`: Remove the `dist` directory.
- `npm run dev:migrate`: Run Prisma migrations in development.
- `npm run prod:migrate`: Deploy Prisma migrations in production.
- `npm run dev:studio`: Open Prisma Studio for database management.
- `npm run dev:reset`: Reset the database in development.
- `npm run setup-env`: Generate template `.env` files.
- `npm run prisma:generate`: Generate Prisma client.
- `npm run lint`: Run ESLint to check code quality.
- `npm run lint:fix`: Run ESLint and automatically fix issues.

## Project Structure

```
.
└── express-authentication/
    ├── docs
    ├── prisma
    ├── scripts
    ├── src/
    │   ├── config
    │   ├── controllers
    │   ├── middlewares
    │   ├── repository
    │   ├── routes
    │   ├── schemas
    │   ├── services
    │   ├── templates
    │   ├── types
    │   ├── utils
    │   └── main.ts
    ├── .env.development
    └── .env.production
```

## Usage

1. **Start the server**:

   - Development: `npm run dev`
   - Production: `npm run build && npm start`

2. **API Endpoints** (example):

   - `POST /api/auth/register`: Register a new user
   - `POST /api/auth/login`: Log in and receive a JWT
   - `POST /api/auth/verify-email`: Verify email with token
   - `GET /api/auth/profile`: Get authenticated user profile (requires JWT)

3. **Prisma Studio**:
   Run `npm run dev:studio` to explore and manage your database.

4. **Linting**:
   Ensure code quality with `npm run lint` or fix issues with `npm run lint:fix`.

## License

This project is licensed under the ISC License.
