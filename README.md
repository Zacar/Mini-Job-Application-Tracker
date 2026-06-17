# Mini-Job-Application-Tracker






API Documentation
1. Create an Application
Creates a new record in your job tracker.
URL: /applications
Method: POST
Headers: Content-Type: application/json
Request Body:
JSON
{
  "company_name": "internSathi",
  "job_title": "Backend Intern",
  "job_type": "Internship",
  "status": "Applied",
  "applied_date": "2026-06-17",
  "notes": "Applied via referral."
}
Success Response:
Code: 201 CREATED
Body:
JSON
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
Validation Error Response:
Code: 400 BAD REQUEST
Body: {"error": "Company Name is required and must be at least 2 characters long."}

2. Get All Applications (With Filtering & Search)
Retrieves your full tracking list. Supports conditional sorting and search parameters natively.
URL: /applications
Method: GET
Query Params (Optional): * status (e.g., Applied, Interviewing, Offer, Rejected) — Case-sensitive match
search (any text string) — Matches company or title case-insensitively
Example Filter Request: /applications?status=Applied&search=backend

Success Response:
Code: 200 OK
Body:
JSON
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


3. Get a Single Application
Fetches the detailed breakdown of one entry.
URL: /applications/:id
Method: GET

Success Response:
Code: 200 OK
Body:
JSON
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "internSathi",
    "job_title": "Backend Intern"
    // ... rest of fields
  }
}

Error Response:
Code: 404 NOT FOUND
Body: {"success": false, "message": "Application not found"}

4. Update an Application (Partial)
Modifies specific values of an existing record without requiring you to pass the whole payload body back.
URL: /applications/:id
Method: PATCH
Request Body (Partial Example):
JSON
{
  "status": "Interviewing",
  "notes": "First round schedule for tomorrow!"
}

Success Response:
Code: 200 OK
Body:
JSON
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


5. Delete an Application
Removes an active entry completely from your database tracking tables.
URL: /applications/:id
Method: DELETE

Success Response:
Code: 200 OK
Body: "application was deleted"
