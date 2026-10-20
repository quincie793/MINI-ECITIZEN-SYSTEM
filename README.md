Mini eCitizen - Public Service Request System
A full-stack, role-based web application designed to streamline public service requests. Citizens can report issues (such as broken streetlights, water leaks, or uncollected garbage), and administrators have a dedicated dashboard to track, manage, and resolve these cases.

Live Demo:
Frontend (Vercel): https://mini-ecitizen-system-yec2.vercel.app

Backend API (Render): https://mini-ecitizen-system.onrender.com

(Note: The backend is hosted on Render's free tier. If it has been inactive, the first request may take 30-50 seconds to wake up the server. Please be patient!)

Tech Stack
Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios

Backend: Node.js, Express, TypeScript

Database: PostgreSQL (Hosted on Neon)

ORM: Prisma

File Storage: Cloudinary (for secure, cloud-based image uploads)

Authentication: JWT (JSON Web Tokens), Bcrypt (password hashing)

Deployment: Vercel (Client), Render (Server)

Core Features:
Authentication & Authorization: Secure registration and login. Role-Based Access Control (RBAC) ensures citizens and admins only access their respective dashboards.

Citizen Portal:
Submit a new service request (Category, Location, Description).

Optional image upload for evidence (powered by Cloudinary).

Track the real-time status of personal requests (Pending, In Progress, Resolved).

Admin Dashboard:
Real-time analytics overview (Total, Pending, In Progress, Resolved).

View all requests submitted by all users.

Search and filter requests by user name, category, or location.

Update request statuses instantly from the dashboard.

View submitted images in full resolution.

Technical Challenges & Solutions:
Ephemeral File Systems in the Cloud: When deploying to Render, I realized that local file storage (uploads/ folder) is wiped clean every time the server restarts. Solution: I integrated Cloudinary using Multer's memory storage to ensure images are securely and permanently hosted in the cloud.

Database Migration: Initially developed using local Microsoft SQL Server (SSMS). To deploy for free in the cloud, I migrated to PostgreSQL using Prisma's schema provider abstraction, requiring minimal code changes and no rewrite of the Express controllers.

CORS Management: Configured dynamic CORS policies on the Express backend to securely allow both local development (localhost:5173) and dynamic Vercel preview deployment URLs.

Local Setup Instructions:
Prerequisites
Node.js installed

A PostgreSQL Database URL (e.g., from Neon.tech)

Cloudinary Account credentials

1. Backend Setup (Server)
bash
cd server
npm install
Create a .env file in the root of the server folder and add your environment variables:

env
PORT=5000
DATABASE_URL="postgresql://your_neon_connection_string"
JWT_SECRET="your_super_secret_jwt_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
Run Prisma to sync your database schema and generate the client:

bash
npx prisma db push
npx prisma generate
Start the backend server:

bash
npm run dev
2. Frontend Setup (Client)
Open a new terminal window and navigate to the client directory:

bash
cd client
npm install
Start the frontend Vite development server:

bash
npm run dev

Test Credentials:
To test the application, you can register a new account on the live site.

To test the Admin features:

Register a new account on the live site.

Open Prisma Studio locally (npx prisma studio in the server folder connected to the live DB).

Go to the User table, find your email, and change the role from CITIZEN to ADMIN.

Log out and log back into the live site to receive a new Admin JWT token.

OR use:
Admin Account:

Email: irene@test.com

Password: irene@test.com

Citizen Account:

Email: mercy@gmail.com

Password: mercy@gmail.com

Project Structure:
/client - React frontend application (Vite + Tailwind)

/server - Express backend API (Prisma + PostgreSQL)

/prisma - Database schema

/src/routes - Express API routes (Auth, Requests, Admin)

/src/middleware - JWT and Role-Based verification



