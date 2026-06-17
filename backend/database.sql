CREATE DATABASE mini_tracker;

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied',
    applied_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

