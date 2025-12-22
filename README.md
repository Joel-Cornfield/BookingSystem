# Fitness Booking System

A full-stack fitness booking platform that allows members to book classes and personal training sessions, trainers to manage their own sessions, and admins to manage classes, trainers, and schedules.

Built as a portfolio project to demonstrate modern full-stack web development using **ASP.NET Core**, **React**, and **JWT authentication**.

---

## Live Demo

- Render: https://bookingsystemfrontend.onrender.com 

---

## Features

### Authentication & Authorization
- JWT-based authentication (access + refresh tokens)
- Role-based authorization:
  - **Member**
  - **Trainer**
  - **Admin**
- Secure login, registration, and token refresh

### Member
- View available fitness classes
- Book and cancel class sessions
- Book and manage personal training sessions
- View upcoming bookings in dashboard
- Manage profile and change password

### Trainer
- View only their own assigned PT sessions
- Create, update, and cancel personal training sessions
- Secure access restricted to trainer role

### Admin
- Create, update, and delete classes
- Create and manage class sessions
- Promote users to trainers
- Create trainer accounts
- Manage trainers and schedules

---

## Tech Stack

### Frontend
- **React** (Vite)
- **React Router**
- **Context API** (Auth & Bookings state)
- **Tailwind CSS**
- Deployed on **Render**

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **PostgreSQL** (Neon)
- **JWT Authentication**
- **Role-based Authorization**
- **Cloudinary** (profile image uploads)
- Deployed on **Render**

---

## Authentication Flow

- Access token (JWT) valid for 60 minutes
- Refresh token stored securely and rotated
- Automatic token refresh handled client-side
- Protected routes based on authentication & role
  
## Security Highlights

- Passwords hashed using ASP.NET Identity PasswordHasher
- Role-based route protection (frontend + backend)
- Trainer endpoints restricted to trainer-owned data only
- CORS configured for frontend domain
- Refresh token validation and expiry enforcement

---
## ⚙️ Environment Variables

### Backend (.NET)

Configured via environment variables on Render:

ConnectionStrings__DefaultConnection
AppSettings__Token
AppSettings__Issuer
AppSettings__Audience
Cloudinary__Url

> `appsettings.json` does **not** contain secrets in production.

---

### Frontend (Vite)

VITE_API_BASE_URL=https://your-backend-url.onrender.com


