# Rural Machinery Booking System

A full-stack web application for connecting farmers with machinery owners in rural areas. It helps farmers find equipment, compare availability, book time slots, and track usage, while allowing owners to list machines, protect maintenance windows, and manage bookings.

## Overview

This project is designed for agricultural communities where equipment access is often difficult due to fragmented communication, manual scheduling, and limited visibility into machine availability. The app reduces friction by providing a unified booking workflow with bilingual support, location-aware search, calendar-based scheduling, and role-specific dashboards.

## Features

- Farmer and owner role-based dashboards
- English and Kannada language support
- Location search with latitude and longitude handling
- Booking calendar with time-slot validation
- Weekly maintenance-day protection
- Machine listing and profile management
- Booking approvals, cancellations, and status tracking
- Basic analytics for revenue and booking insights
- Secure authentication using JWT and password hashing

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Database: SQLite with SQL.js
- Auth: JWT, bcryptjs
- Styling: CSS with structured component design
- Seed data: Node-based local seeding script

## Project Structure

```text
rural-machinery-booking/
├── client/
│   ├── public/
│   └── src/
├── prisma/
│   └── schema.prisma
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── README.md
├── seed.js
├── server.js
└── dev.db
```

## Demo Accounts

Use these demo credentials to test the application quickly:

- Farmer: Ravi Kumar
  - Phone: 9876543210
  - Password: password123
- Owner: Ramesh Kumar
  - Phone: 9876543211
  - Password: password123

## Prerequisites

- Node.js 18+
- npm 9+

## Local Setup

1. Clone the repository

```bash
git clone https://github.com/RAVICHANDRAK36/rural-machinery-booking.git
cd rural-machinery-booking
```

2. Install dependencies

```bash
npm install
cd client
npm install
cd ..
```

3. Configure environment variables

```bash
cp .env.example .env
```

4. Seed the database

```bash
npm run seed
```

5. Build the frontend

```bash
npm run build:client
```

6. Start the app

```bash
npm start
```

Then open:

```text
http://localhost:5000
```

## Environment Variables

The project expects variables similar to:

```env
PORT=5000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key"
NODE_ENV="production"
```

## API Highlights

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile
- GET /api/machines
- POST /api/machines
- GET /api/bookings
- POST /api/bookings

## Notes

- The app is currently configured for local SQLite development data.
- Frontend is served through the Express server in the current setup.
- The repository is intentionally kept lightweight and easy to run in a local dev environment.

## License

This project is licensed under the MIT License.
