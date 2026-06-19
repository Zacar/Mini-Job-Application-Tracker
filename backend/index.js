const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // req.body

app.post("/applications", async (req, res) => {
  try {
    const { company_name, job_title, job_type, status, applied_date, notes } =
      req.body;

    //validation for status and jobtype
    const allowedStatus = ["Applied", "Interviewing", "Offer", "Rejected"];
    const allowedJobType = ["Internship", "Full-time", "Part-time"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (job_type && !allowedJobType.includes(job_type)) {
      return res.status(400).json({ error: "Invalid job type value" });
    }

    //using safe placeholders ($1, $2, etc.) to prevent SQL Injection
    const newApplication = await pool.query(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        company_name,
        job_title,
        job_type,
        status || "Applied",
        applied_date || new Date().toISOString().split("T")[0],
        notes || "",
      ]
    );

    // console.log("--- DATA SAVED TO DATABASE ---");
    // console.log(newApplication.rows[0]);

    res.status(201).json({
      success: true,
      message: "Application tracked successfully!",
      data: newApplication.rows[0],
    });
  } catch (err) {
    console.error("Database Insert Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/applications", async (req, res) => {
  try {
    const { status, search } = req.query;

    let queryText = "SELECT * FROM applications WHERE 1=1";
    let queryParams = [];
    let paramIndex = 1;

    // If status is provided
    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // If search keyword is provided (checks company_name OR job_title)
    if (search) {
      queryText += ` AND (company_name ILIKE $${paramIndex} OR job_title ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`); // The % allows partial matching (e.g., "intern" matches "Backend Intern")
      paramIndex++;
    }

    // Always sort by newest first
    queryText += " ORDER BY created_at DESC";

    const applications = await pool.query(queryText, queryParams);

    res.json({
      success: true,
      count: applications.rows.length,
      data: applications.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//so we can get applications with required id
app.get("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const application = await pool.query(
      "SELECT * FROM applications WHERE id = $1",
      [id]
    );
    if (application.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, data: application.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//for update
app.patch("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, job_title, job_type, status, applied_date, notes } =
      req.body;
    //validation for status and jobtype
    const allowedStatus = ["Applied", "Interviewing", "Offer", "Rejected"];
    const allowedJobType = ["Internship", "Full-time", "Part-time"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (job_type && !allowedJobType.includes(job_type)) {
      return res.status(400).json({ error: "Invalid job type value" });
    }

    const updateApplication = await pool.query(
      `UPDATE applications 
        SET company_name = COALESCE($1, company_name), 
           job_title    = COALESCE($2, job_title), 
           job_type     = COALESCE($3, job_type), 
           status       = COALESCE($4, status), 
           applied_date = COALESCE($5, applied_date), 
           notes        = COALESCE($6, notes),
             updated_at = NOW()
         WHERE id = $7 
         RETURNING *`,
      [company_name, job_title, job_type, status, applied_date, notes, id]
    );

    //to check if data with id exists
    if (updateApplication.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} was not found.`,
      });
    }

    // //  updated data log
    // console.log(updateApplication.rows[0]);

    res.json({
      success: true,
      message: "Application updated successfully!",
      data: updateApplication.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
