const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json()); // req.body

app.post("/mini_tracker", async (req, res) => {
  try {
    //Destructure the values sent from Postman's JSON body
    const { company_name, job_title, job_type, status, applied_date, notes } =
      req.body;

    //using safe placeholders ($1, $2, etc.) to prevent SQL Injection
    const newApplication = await pool.query(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        company_name,
        job_title,
        job_type,
        status || "Applied", // Falls back to 'Applied' if status is missing
        applied_date || new Date(), // Falls back to today's date if missing
        notes || "", // Falls back to empty string if missing
      ]
    );

    console.log("--- DATA SAVED TO DATABASE ---");
    console.log(newApplication.rows[0]);
    console.log("------------------------------");

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

app.listen(8080, () => {
  console.log("server run on: 8080");
});
