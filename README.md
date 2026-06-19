## Mini Job Application Tracker


**Video Demo:** https://drive.google.com/file/d/1-csI39-r4RTluPftyLo0wVQRP0P58prY/view?usp=drive_link


**Live Demo:** https://mini-job-application-tracker-five.vercel.app/

> **Note:** The backend is hosted on Render's free tier and may take 1–2 minutes to wake up when accessed after a period of inactivity.

A full-stack web application for tracking internship and job applications. Built with **React**, **TypeScript**, **Node.js**, **Express**, and **PostgreSQL**.

### Development Timeline (3 Days)

#### Day 1 – Backend Development

* Designed and developed a lightweight REST API using **Node.js**, **Express**, and **PostgreSQL**.
* Implemented CRUD operations for managing job applications.
* Tested API endpoints throughout development using **Postman**.

#### Day 2 – Frontend Development

* Built a responsive user interface using **React**, **TypeScript**, and **Tailwind CSS**.
* Integrated frontend components with backend API endpoints.
* Added project documentation and updated the README.

#### Day 3 – Finalization & Deployment

* Performed code cleanup and refactoring to improve maintainability.
* Deployed the PostgreSQL database using Neon.
* Deployed the backend API on Render.
* Deployed the frontend application on Vercel.
* Conducted final testing and verification of the complete application.

### Tech Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Vite

**Backend**

* Node.js
* Express.js
* PostgreSQL

**Deployment & Services**

* Neon (PostgreSQL Database)
* Render (Backend Hosting)
* Vercel (Frontend Hosting)


### Development Tools

- Nodemon

---

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher recommended)
- PostgreSQL installed and running

---

#How to Run on development mode on your local machine

## Database Setup

Create the database and required tables by running the following SQL commands:

```sql
CREATE DATABASE mini_tracker;

CREATE TYPE job_type_enum AS ENUM (
    'Internship',
    'Full-time',
    'Part-time'
);

CREATE TYPE status_enum AS ENUM (
    'Applied',
    'Interviewing',
    'Offer',
    'Rejected'
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_type job_type_enum NOT NULL,
    status status_enum NOT NULL DEFAULT 'Applied',
    applied_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Useful PostgreSQL Commands

```bash
\l                  # List databases

\c mini_tracker     # Connect to database

\dt                 # Show tables

SELECT * FROM applications;
```

---

## Backend Setup

Navigate to the backend directory:

```
cd backend
```

Install dependencies:

```
npm install
```

Create a `.env` file inside the `backend` folder:

```env
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mini_tracker
#FRONTEND_URL=https://yoururl.com/(only for deployment doesnot require for local dev mode ie http://localhost:5173)
i have used yourdatabasename = mini_tracker
yourpassword=master password which you kept in postgres setup
```

Start the backend server:

```bash
nodemon index.js || node index.js
```

Expected output:

```bash
Server running on port 8080
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```
Create a `.env` file inside the `frontend` folder:

```env
# VITE_API_BASE_URL=http://localhost:8080 (backend local host port)
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed in the terminal (usually):

```text
http://localhost:5173
```

---

## Installation From Scratch

### Backend

```bash
mkdir backend
cd backend

npm init -y

npm install express pg cors dotenv

npm install --save-dev nodemon
```

### Frontend

```bash
npm create vite@latest frontend -- --template react-ts
```

### Tailwind CSS Setup

Follow the official Tailwind CSS installation guide:

https://tailwindcss.com/docs/installation/using-vite

---

##Env file example

#keep this env in /backend/.env

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mini_tracker

```
#keep this env in /frontend/.env

```
VITE_API_BASE_URL=http://localhost:8080 
```

# API Documentation

## 1. Create an Application

Creates a new record in your job tracker.

**URL:** `/applications`  
**Method:** `POST`  
**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

### Request Body

```json
{
  "company_name": "internSathi",
  "job_title": "Backend Intern",
  "job_type": "Internship",
  "status": "Applied",
  "applied_date": "2026-06-17",
  "notes": "Applied via referral."
}
```

### Success Response

**Status:** `201 CREATED`

```json
{
  "success": true,
  "message": "Application tracked successfully!",
  "data": {
    "id": 1,
    "company_name": "internSathi",
    "job_title": "Backend Intern",
    "job_type": "Internship",
    "status": "Applied",
    "applied_date": "2026-06-17T00:00:00.000Z",
    "notes": "Applied via referral.",
    "created_at": "2026-06-17T11:28:50.325Z",
    "updated_at": "2026-06-17T11:28:50.325Z"
  }
}
```

### Validation Error Response

**Status:** `400 BAD REQUEST`

```json
{
  "error": "Company Name is required and must be at least 2 characters long."
}
```

---

## 2. Get All Applications

Retrieves all applications with optional filtering and search.

**URL:** `/applications`  
**Method:** `GET`

### Query Parameters

| Parameter | Description                            |
| --------- | -------------------------------------- |
| status    | Applied, Interviewing, Offer, Rejected |
| search    | Searches company name or job title     |

### Example Request

```http
GET /applications?status=Applied&search=backend
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "company_name": "internSathi",
      "job_title": "Backend Intern",
      "job_type": "Internship",
      "status": "Applied",
      "applied_date": "2026-06-17T00:00:00.000Z",
      "notes": "Applied via referral.",
      "created_at": "2026-06-17T11:28:50.325Z",
      "updated_at": "2026-06-17T11:28:50.325Z"
    }
  ]
}
```

---

## 3. Get a Single Application

Fetches a single application by ID.

**URL:** `/applications/:id`  
**Method:** `GET`

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "internSathi",
    "job_title": "Backend Intern"
  }
}
```

### Error Response

**Status:** `404 NOT FOUND`

```json
{
  "success": false,
  "message": "Application not found"
}
```

---

## 4. Update an Application

Updates specific fields of an application.

**URL:** `/applications/:id`  
**Method:** `PATCH`

### Request Body

```json
{
  "status": "Interviewing",
  "notes": "First round schedule for tomorrow!"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Application updated successfully!",
  "data": {
    "id": 1,
    "company_name": "internSathi",
    "job_title": "Backend Intern",
    "job_type": "Internship",
    "status": "Interviewing",
    "applied_date": "2026-06-17T00:00:00.000Z",
    "notes": "First round schedule for tomorrow!",
    "created_at": "2026-06-17T11:28:50.325Z",
    "updated_at": "2026-06-17T11:45:12.000Z"
  }
}
```

---

## 5. Delete an Application

Removes an application from the database permanently.

**URL:** `/applications/:id`  
**Method:** `DELETE`

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Application deleted successfully",
  "data": {
    "id": 1,
    "company_name": "internSathi",
    "job_title": "Backend Intern",
    "job_type": "Internship",
    "status": "Applied",
    "applied_date": "2026-06-17T00:00:00.000Z",
    "notes": "Applied via referral.",
    "created_at": "2026-06-17T11:28:50.325Z",
    "updated_at": "2026-06-17T11:28:50.325Z"
  }
}
```

### Error Response

**Status:** `404 NOT FOUND`

```json
{
  "success": false,
  "message": "Application with ID 1 not found"
}
```

## Author

**Sakar Manandhar**
