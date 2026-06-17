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