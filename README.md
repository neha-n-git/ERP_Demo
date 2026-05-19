# Demo Incubation Management System

A full-stack, enterprise-grade ERP web application designed as a demonstration for a startup incubator or coworking space.

## Technology Stack
- **Frontend**: React.js, React Router v6, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL / MySQL (via Sequelize ORM)
- **Features**: Authentication, File Uploads (Multer), Email Automation (Nodemailer)

## Modules Included
1. **Public Registration**: A clean, responsive form for startups to apply.
2. **Admin Dashboard**: Analytics and quick actions.
3. **Startup Registry**: Status tracking and document management.
4. **People Roster**: IT and HR provisioning checklist for individuals.
5. **Resource Tracker**: Visual seating map and boardroom scheduler.
6. **Payments & Billing**: Auto-generated invoices and email reminders.
7. **Support & Mentoring Desk**: Help desk logs and templated emails.

## How to Run

1. **Database Setup**
   Create a local MySQL or PostgreSQL database named `demo_erp`.
   Configure the credentials in `server/.env`.

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Login Credentials**
   - Email: `admin@demo-incubator.com`
   - Password: `admin123`
