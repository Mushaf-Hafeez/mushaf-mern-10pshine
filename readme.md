# NoteFlow

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-purple?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2.1-black?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.4.1-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Zod](https://img.shields.io/badge/Zod-4.x-000000?logo=zod&logoColor=white)](https://zod.dev)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [SonarQube Integration](#sonarqube-integration)
- [API Overview](#api-overview)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Project Overview

NoteFlow is a full-stack note management application built during the 10Pearls virtual internship program. It provides secure user registration with OTP verification, password recovery, profile management, and a complete note lifecycle.

This project demonstrates a clean MERN-style architecture with TypeScript on both frontend and backend, Cloudinary-powered profile image uploads, automated tests, and SonarQube-ready code quality support.

## Features

### Authentication

- User registration with OTP-based email verification
- OTP expiration handling and temporary signup storage
- Login and logout flows
- Forgot password flow with email reset link
- Password reset with token validation
- Secure JWT authentication
- Cookie-based auth session management

### Profile Management

- Fetch authenticated user profile
- Update display name
- Upload profile image using Cloudinary
- Protected profile APIs with JWT middleware

### Notes Management

- Create new notes
- View paginated note listings
- Search notes by title or content
- Retrieve single note details
- Edit existing notes
- Delete notes
- User-specific note ownership and isolation

### Validation

- Frontend validation powered by Zod patterns
- Backend validation using Zod schemas
- Consistent validation on authentication, notes, and profile updates

### Security

- Token verification for protected routes
- HTTP-only cookie-based auth storage
- Password hashing with bcrypt
- Backend validation middleware and error handling

### Testing

- Frontend unit tests with Vitest and Testing Library
- Backend unit tests with Mocha, Chai, and Sinon
- Coverage reporting for both frontend and backend

### Code Quality

- SonarQube integration for both frontend and backend
- Separate `sonar-project.properties` files for each module
- Coverage report integration via LCOV

## Tech Stack

### Frontend Technologies

| Technology      | Role                          |
| --------------- | ----------------------------- |
| React           | UI rendering and routing      |
| TypeScript      | Static typing                 |
| Vite            | Development and build tooling |
| Shadcn UI       | Component styling primitives  |
| React Hook Form | Form handling                 |
| Zod             | Runtime validation            |
| Zustand         | State management              |
| Tailwind CSS    | Styling                       |

### Backend Technologies

| Technology | Role                    |
| ---------- | ----------------------- |
| Node.js    | Runtime environment     |
| Express.js | API server              |
| MongoDB    | Database                |
| Mongoose   | MongoDB object modeling |
| TypeScript | Backend typing          |
| Zod        | Request validation      |
| Cloudinary | Profile image storage   |
| JWT        | Authentication          |
| Nodemailer | Email delivery          |

### Testing Technologies

| Technology      | Role                        |
| --------------- | --------------------------- |
| Vitest          | Frontend testing            |
| Testing Library | UI behavior assertions      |
| User Event      | Browser interaction testing |
| JSDOM           | DOM environment for tests   |
| V8 Coverage     | Frontend coverage reports   |
| Mocha           | Backend test runner         |
| Chai            | Backend assertions          |
| Sinon           | Backend mocks and spies     |

### Code Quality Tools

| Tool      | Role                              |
| --------- | --------------------------------- |
| SonarQube | Static analysis and quality gates |

## Architecture Overview

NoteFlow separates frontend and backend responsibilities.

- Frontend: React application built with Vite and TypeScript, consuming secured REST endpoints.
- Backend: Express API server with MongoDB, Mongoose, and Zod validation.
- Authentication state is managed by Zustand and protected routes are enforced by a custom `ProtectedRoute` component.

### Authentication Flow

1. User requests OTP during signup.
2. Backend stores temporary signup data and sends a 6-digit OTP email.
3. User verifies OTP to create the account.
4. Backend issues a JWT token and stores it in an `httpOnly` cookie.
5. Protected routes validate the cookie token for authenticated access.
6. Forgot password requests generate a reset link and email it to the user.

### Note Management Flow

- Notes are created, retrieved, updated, and deleted through protected APIs.
- Each note is tied to the authenticated user ID.
- Search and pagination are supported at the API layer.

## Project Structure

```
Note Project/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── sonar-project.properties
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.config.ts
│   │   │   ├── db.config.ts
│   │   │   ├── multer.config.ts
│   │   │   └── nodemailer.config.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── note.controller.ts
│   │   │   └── profile.controller.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── models/
│   │   │   ├── note.model.ts
│   │   │   ├── otp.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── note.route.ts
│   │   │   └── profile.route.ts
│   │   ├── templates/
│   │   │   └── templates.ts
│   │   ├── tests/
│   │   │   ├── controllers/
│   │   │   ├── utils/
│   │   │   └── validations/
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   ├── httpLogger.ts
│   │   │   ├── logger.ts
│   │   │   └── utils.ts
│   │   ├── validators/
│   │   │   └── validations.ts
│   │   └── index.ts
│   └── coverage/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── sonar-project.properties
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── custom/
│   │   │   └── ui/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── zustand/
│   │   └── test/
└── readme.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Mushaf-Hafeez/mushaf-mern-10pshine
cd "Note Project"
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Environment Variables

### Frontend

| Variable           | Description                             |
| ------------------ | --------------------------------------- |
| `VITE_BACKEND_URL` | Backend API base URL used by Axios      |
| `VITE_MODE`        | Frontend mode used for runtime behavior |

### Backend

| Variable                | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `PORT`                  | Server port                                         |
| `DATABASE_URL`          | MongoDB connection string                           |
| `MAIL_SERVICE`          | Nodemailer email service provider                   |
| `MAIL_USER`             | Sender email address                                |
| `MAIL_PASS`             | Email account password or API key                   |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name                             |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                  |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                               |
| `JWT_SECRET`            | JWT signing secret                                  |
| `NODE_ENV`              | Environment mode for production/development         |
| `FRONTEND_URL`          | Frontend URL used for password reset links and CORS |

## Running the Application

### Backend

Development:

```bash
cd backend
npm run dev
```

Production:

```bash
cd backend
npm run prod
```

### Frontend

Development:

```bash
cd frontend
npm run dev
```

Production build:

```bash
cd frontend
npm run build
```

## Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

Open the Vitest UI:

```bash
cd frontend
npm run test:ui
```

Generate coverage:

```bash
cd frontend
npm run test:coverage
```

### Backend Testing

```bash
cd backend
npm run test
```

Generate coverage:

```bash
cd backend
npm run test:coverage
```

### Coverage Reports

- Frontend coverage is generated under `frontend/coverage/`.
- Backend coverage is generated under `backend/coverage/lcov.info`.

## SonarQube Integration

This repository includes separate SonarQube setups for frontend and backend.

- `backend/sonar-project.properties`
- `frontend/sonar-project.properties`

Both configurations point to `http://localhost:9000` and use LCOV coverage reports.

Run a scan with:

```bash
sonar-scanner -Dsonar.token=<your_token>
```

## API Overview

### Authentication

- `POST /api/v1/auth/otp` — send signup OTP via email
- `POST /api/v1/auth/signup` — verify OTP and create account
- `POST /api/v1/auth/login` — authenticate and set auth cookie
- `PUT /api/v1/auth/forgot-password` — request reset email
- `PUT /api/v1/auth/reset-password` — update password with token
- `GET /api/v1/auth/check-auth` — confirm active session
- `DELETE /api/v1/auth/delete-account` — remove authenticated account
- `POST /api/v1/auth/logout` — clear authentication cookie

### Profile

- `GET /api/v1/profile/` — fetch current user profile
- `PUT /api/v1/profile/` — update user name
- `PUT /api/v1/profile/profile-pic` — upload profile image

### Notes

- `GET /api/v1/notes/` — list user notes with pagination
- `GET /api/v1/notes/search` — search notes by title/content
- `GET /api/v1/notes/:id` — fetch one note
- `POST /api/v1/notes/` — create a note
- `PUT /api/v1/notes/:id` — update a note
- `DELETE /api/v1/notes/:id` — delete a note

## Security Considerations

- `httpOnly` JWT cookie storage limits client-side access
- Protected endpoints require token validation
- Passwords are stored hashed with bcrypt
- Zod validation prevents malformed payloads
- CORS is restricted using `FRONTEND_URL`

## Future Improvements

- Add role-based authorization and multi-user collaboration
- Implement rich text / markdown note editing
- Add offline support and sync capabilities
- Expand end-to-end test coverage
- Add Docker deployment and CI/CD pipelines

## Contributing

This project currently does not support contributions.

## License

This project currently does not specify a license.

## Author

Mushaf Hafeez

Full Stack MERN Developer

Developed during the 10Pearls Virtual Internship Program
