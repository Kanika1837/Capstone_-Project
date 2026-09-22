const express = require("express");
const router = express.Router();

const pool = require("../db");

// CREATE SKILL SWAP REQUEST
router.post("/", async (req, res) => {
    try {
        const {
            requesterId,
            mentorId,
            skillName
        } = req.body;

        if (!requesterId || !mentorId || !skillName) {
            return res.status(400).json({
                message: "Requester, mentor and skill are required"
            });
        }

        // Check whether selected skill exists
        const skillResult = await pool.query(
            "SELECT * FROM skills WHERE LOWER(skill_name) = LOWER($1)",
            [skillName]
        );

        if (skillResult.rows.length === 0) {
            return res.status(404).json({
                message: "Skill not in database"
            });
        }

        // Create request
        const result = await pool.query(
            `INSERT INTO skill_swap_requests
            (requester_id, mentor_id, skill_name, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING *`,
            [requesterId, mentorId, skillName]
        );

        res.status(201).json({
            message: "Skill swap request sent successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Request Error:", error);

        res.status(500).json({
            message: "Failed to create skill swap request",
            error: error.message
        });
    }
});


// GET ALL REQUESTS
router.get("/", async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM skill_swap_requests
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Get Requests Error:", error);

        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
});


module.exports = router;