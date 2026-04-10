# Result Management System

A full-stack Result Management System for academic result publishing and lookup. The project includes a React frontend, an Express API, MongoDB integration, JWT authentication, and role-based dashboards for admin, faculty, and students.

## Features

- Public result search by roll number
- Admin, faculty, and student login flows
- Student dashboard with printable marksheet
- Faculty dashboard for publishing and updating results
- Admin controls for complete result management
- JWT authentication with bcrypt password hashing
- MongoDB models and REST API-based CRUD operations

## Tech Stack

- Frontend: React, Vite, React Router, Framer Motion, Recharts
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB

## Project Structure

```text
result management system/
└── student-result-system/
    ├── frontend/
    └── backend/
```

## Local Setup

### 1. Backend

```bash
cd "result management system/student-result-system/backend"
npm install
npm run dev
```

The backend uses these defaults if no `.env` file is provided:

- `PORT=5001`
- `MONGO_URI=mongodb://127.0.0.1:27017/result_management_system`
- `JWT_SECRET=dev-result-management-secret`

Optional seeded users:

- Admin: `admin@campus.edu` / `Admin@123`
- Faculty: `faculty@campus.edu` / `Faculty@123`

### 2. Frontend

```bash
cd "result management system/student-result-system/frontend"
npm install
npm run dev
```

For local development, the frontend can use the default relative `/api` path.

For deployment, create a frontend `.env` file if needed:

```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Default Login Notes

- Admin and faculty accounts are seeded when the backend starts.
- Student accounts are created when a result is published.
- If no student password is entered, the system uses `ROLLNUMBER@123`.

## GitHub Repository Setup

1. Create a new empty repository on GitHub.
2. Open a terminal in the project root:

```bash
cd "/Users/janvi/Desktop/result management system-AWT"
git add .
git commit -m "Initial project commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

3. Add your GitHub repository link here after pushing:

```text
https://github.com/your-username/your-repo-name
```

## How To Create Source Code ZIP

Create the ZIP from the project root so it includes the full source code and README:

```bash
cd "/Users/janvi/Desktop/result management system-AWT"
zip -r result-management-system.zip "result management system" .gitignore
```

If your college does not want dependencies included, delete `node_modules` first or zip only the source folders after removing them.

## Deployment Guide

### Backend Deployment on Render

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Set the Root Directory to:

```text
result management system/student-result-system/backend
```

4. Use:

- Build Command: `npm install`
- Start Command: `npm start`

5. Add environment variables:

- `MONGO_URI=your-mongodb-atlas-connection-string`
- `JWT_SECRET=your-strong-secret`
- `PORT=10000`

6. Copy the deployed backend URL, for example:

```text
https://your-backend-name.onrender.com
```

### Frontend Deployment on Vercel

1. Import the same GitHub repository into Vercel.
2. Set the Root Directory to:

```text
result management system/student-result-system/frontend
```

3. Add the environment variable:

```text
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

4. Deploy the frontend.

5. Copy the deployed frontend URL, for example:

```text
https://your-project-name.vercel.app
```

## Submission Checklist

- Full source code ZIP
- GitHub repository link
- README file
- Deployed frontend link
- Deployed backend link

## Final Submission Format

Use this format in your report or submission document:

```text
Source Code ZIP: result-management-system.zip
GitHub Repository: https://github.com/your-username/your-repo-name
Frontend Deployment: https://your-project-name.vercel.app
Backend Deployment: https://your-backend-name.onrender.com
```
