const express = require("express");
const router = express.Router();
const pool = require("../db");

// Save certificate details
router.post("/", async (req, res) => {
    try {
        const {
            user_name,
            skill_name,
            mentor_name
        } = req.body;

        if (!user_name || !skill_name || !mentor_name) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO certificates
            (user_name, skill_name, mentor_name)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [user_name, skill_name, mentor_name]
        );

        res.status(201).json({
            message: "Certificate saved successfully",
            certificate: result.rows[0]
        });

    } catch (error) {
        console.error("Certificate error:", error.message);

        res.status(500).json({
            message: "Failed to save certificate",
            error: error.message
        });
    }
});

// Get all certificates
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM certificates ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch certificates",
            error: error.message
        });
    }
});

module.exports = router;