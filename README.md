# Mini-Job-Application-Tracker

##Env file example

```
DB_USER=postgres
DB_PASSWORD=y"our_password"
DB_NAME="database_name" || mini_tracker
DB_HOST=localhost
DB_PORT=5432
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

Deletes an application permanently.

**URL:** `/applications/:id`  
**Method:** `DELETE`

### Success Response

**Status:** `200 OK`

```json
{
  "message": "application was deleted"
}
```
