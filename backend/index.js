const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json()); // req.body

app.post("/mini_tracker", async (req, res) => {
  try {
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
        status || "Applied",
        applied_date || new Date(),
        notes || "",
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

app.get("/mini_tracker", async (req, res) => {
  try {
    const allApplication = await pool.query("SELECT * FROM applications");
    res.json(allApplication.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//so we can get applications with required id
app.get("/mini_tracker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const application = await pool.query(
      "SELECT * FROM applications WHERE id = $1",
      [id]
    );
    res.json(application.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//for update
app.put("/mini_tracker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, job_title, job_type, status, applied_date, notes } =
      req.body;
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

    //  updated data log
    console.log(updateApplication.rows[0]);

    res.json({
      success: true,
      message: "Application updated successfully!",
      data: updateApplication.rows[0],
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/mini_tracker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteApplication = await pool.query(
      "DELETE FROM  applications WHERE id=$1",
      [id]
    );
    res.json("application was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(8080, () => {
  console.log("server run on: 8080");
});
