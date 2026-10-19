Mini eCitizen application
A full-stack, role-based web application designed to streamline public service requests. Citizens can report issues (such as broken streetlights, water leaks, or uncollected garbage), and administrators have a dedicated dashboard to track, manage, and resolve these cases.

Tech Stack:
Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios

Backend: Node.js, Express, TypeScript

Database: SQL Server

ORM: Prisma

Security: JWT (JSON Web Tokens), Bcrypt (password hashing)

File Uploads: Multer

Core Features:
Authentication & Authorization: Secure login and registration. Role-Based Access Control (RBAC) ensures citizens and admins only see their respective dashboards.

Citizen Portal:

Submit a new service request (Category, Location, Description).

Optional image upload for evidence.

Track the status of personal requests (Pending, In Progress, Resolved).

Admin Dashboard:

Real-time analytics overview (Total, Pending, In Progress, Resolved).

View all requests submitted by all users.

Search and filter requests by user name, category, or location.

Update request statuses instantly from the dashboard.

Click on submitted images to view them in full size.

Local Setup Instructions:
Follow these steps to run the project locally.

Prerequisites
Node.js installed

SQL Server running locally

1. Backend Setup (Server)
Open a terminal and navigate to the server directory:

bash
cd server
npm install
Create a .env file in the root of the server folder and add your environment variables:

env
PORT=5000
DATABASE_URL="sqlserver://localhost:1433;database=mini_ecitizen;user=your_db_user;password=your_db_password;encrypt=true;trustServerCertificate=true"
JWT_SECRET="your_super_secret_jwt_key_here"
Run Prisma migrations to set up your database tables, then generate the Prisma client:

bash
npx prisma migrate dev --name init
npx prisma generate
Start the backend server:

bash
npm run dev
(The server should now be running on http://localhost:5000)

2. Frontend Setup (Client)
Open a new terminal window and navigate to the client directory:

bash
cd client
npm install
Start the frontend Vite development server:

bash
npm run dev
(The app will be accessible at http://localhost:5173)

Test Credentials:
If you have populated your database with test users, you can use the following credentials to explore the system:

Admin Account:

Email: irene@test.com

Password: 123456

Citizen Account:

Email: zenalfa@gmail.com

Password: 123456

Project Structure:
/client - React frontend application (Vite + Tailwind)

/server - Express backend API (Prisma + SQL Server)

/prisma - Database schema and migrations

/src/routes - Express API routes (Auth, Requests, Admin)

/src/middleware - JWT and Role-Based verification

/uploads - Local storage for uploaded images

