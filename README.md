# DriveOnRyd (VRM)

DriveOnRyd is a comprehensive Vehicle Rental Management platform facilitating the rental of Two Wheelers, Cars, Buses, Trucks, and Drivers across India. This repository contains both the frontend and backend applications for the platform.

## Architecture

The project is structured with separate frontend and backend directories.

*   **Frontend**: Built with React (Create React App), utilizing Zustand for state management, React Query for data fetching, Bootstrap for layout/styling, and Chart.js/ApexCharts for analytics.
*   **Backend**: A RESTful API built with Node.js, Express, and Sequelize ORM connecting to a PostgreSQL database. It includes Stripe integration for payments, Nodemailer for emails, and JWT for authentication.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended due to `--watch` usage)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd VRM
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Create a `.env` file in the `backend` directory based on the `.env.example`:
```bash
cp .env.example .env
```
Update the `.env` file with your PostgreSQL credentials, JWT secret, Stripe keys, and SMTP configuration.

Database Setup:
Ensure your PostgreSQL server is running and the database specified in your `.env` exists. Run migrations and seed the database:
```bash
npm run migration:run
npm run seed:all
```

Start the backend server:
```bash
# Development mode with watch
npm run dev

# Or production mode
npm start
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Ensure you configure the `.env` file in the `frontend` directory with required API URLs (if needed) and Stripe public keys.

Start the frontend application:
```bash
npm start
```

The application will typically run on `http://localhost:3000` (Frontend) and the backend API will run on the port specified in your server configuration (usually `http://localhost:5000` or `http://localhost:3001`).

## Scripts

### Backend Scripts
*   `npm run dev`: Starts the development server using `node --watch`.
*   `npm start`: Starts the production server.
*   `npm run migration:run`: Runs Sequelize database migrations.
*   `npm run migration:undo`: Undoes all database migrations.
*   `npm run seed:all`: Seeds the database with initial designations and admin user.
*   `npm run test`: Runs Jest tests with coverage.
*   `npm run lint`: Runs ESLint to find code issues.
*   `npm run format`: Formats code using Prettier.

### Frontend Scripts
*   `npm start`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `build` folder.
*   `npm test`: Launches the test runner.

## Tech Stack

*   **Frontend**: React, Zustand, React Query, Bootstrap, Styled Components, Axios, Stripe React.
*   **Backend**: Node.js, Express, Sequelize, PostgreSQL, JWT, NodeMailer, Stripe, Joi.
