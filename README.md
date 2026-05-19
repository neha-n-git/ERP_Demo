# SJRI Incubation Management System (SJHIF ERP)

A full-stack, enterprise-grade ERP web application designed specifically for **St. John's Health Innovation Foundation (SJHIF)** — a leading not-for-profit health innovation incubator based in Koramangala, Bangalore.

---

## 🎨 Design & Visual Identity

This system matches the premium branding of the official [SJHIF website](https://www.sjhif.in):
- **Primary Navy Blue**: `#0D2C54` (Headers, Sidebars, Admin Controls)
- **Background Slate**: `#F2F3F5` (Clean, professional, light grey institutional background)
- **Accent Emerald Green**: `#10B981` (High-visibility call-to-actions, successful status tags, and buttons)
- **Typography**: Clean Sans-Serif interface (Inter / System font stack)
- **Logo Integration**: Official SJHIF branding loaded directly from their media libraries.

---

## 🏗️ Technical Stack

- **Frontend**: React.js with React Router (v6), Context API for state orchestration, and Tailwind CSS for styling.
- **Backend**: Node.js + Express.js with a modular API route design.
- **Database**: PostgreSQL with Sequelize ORM for secure schema creation and relations.
- **Auth**: Secure JSON Web Token (JWT) credentials containing secure password hashing powered by `bcryptjs` and request rate limiting.
- **Email Dispatch**: Nodemailer service for automatic startup notifications and instant invoice billing reminders.

---

## 📦 System Modules

1. **Module 1: Public Startup Registration Form**: A beautiful public signup interface with multi-checkbox resource requirements, detailed founder roster inputs, and PDF pitch deck uploads. Includes responsive inline embedding designs.
2. **Module 2: Admin Dashboard Home Screen**: Centralized KPI metrics tracking active startups, incoming reviews, seating capacities, monthly collections, and daily boardroom reservations.
3. **Module 3: Startup Management Registry**: Admin control panel for profiles, onboarding timelines, status transitions (`Active`, `On Hold`, `Graduated`, `Rejected`), document review, and note attachments.
4. **Module 4: People Registry & Daily Log**: High-performance Roster tracking IT & HR hardware/access allocations with a manual daily sign-in log and full list exports directly to CSV format.
5. **Module 5: Physical Resource Seating & Booking**: Seating map visualization showing occupancy status. Built-in interactive calendar scheduler for boardrooms with automatic overlap booking validations.
6. **Module 6: Billing & Invoicing Console**: Auto-computes monthly charges based on active membership headcounts and configured desk rates. Includes a single-click email invoice reminder dispatcher.
7. **Module 7: Support & Mentoring Desk**: Built-in support request logger (IT / HR / Facility) and a direct templated mentoring request mailer dispatching to `enquiry@sjhif.in`.

---

## 🚀 Setup & Execution Instructions

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or above)
- **npm** (v9.x or above)
- **PostgreSQL** running locally (or via Docker)

### 1. Database Setup
Create a PostgreSQL database named `sjhif_erp`:
```sql
CREATE DATABASE sjhif_erp;
```

### 2. Environment Variables Configuration
Create a `.env` file inside the `server/` directory following the blueprint provided in `server/.env.example`.
Update database credentials (`DB_USER`, `DB_PASS`, `DB_HOST`, etc.) matching your PostgreSQL credentials.

### 3. Installation
From the root workspace directory, execute:
```bash
npm run install-all
```
This single command handles root dependencies, Express backend dependencies, and Vite frontend dependencies.

### 4. Seed Initial Data
Seed 3 startups, 8 members, 2 boardrooms, and 2 months of payment history:
```bash
npm run seed
```

### 5. Start Development Servers
To boot up both the Express backend API and the Vite frontend dev server concurrently:
```bash
npm run dev
```
- **Backend API**: Running at `http://localhost:5000`
- **Frontend App**: Running at `http://localhost:5173`
