const express = require("express");
const router = express.Router();

const pool = require("../db");

// ==========================================
// SAVE / UPDATE LEARNING PROGRESS
// ==========================================
router.post("/progress", async (req, res) => {
    try {
        const {
            requestId,
            userId,
            skillName,
            progress,
            courseCompleted
        } = req.body;

        if (!requestId || !userId || !skillName) {
            return res.status(400).json({
                message: "requestId, userId and skillName are required"
            });
        }

        // Check whether progress already exists
        const existing = await pool.query(
            `SELECT *
             FROM learning_progress
             WHERE request_id = $1`,
            [requestId]
        );

        let result;

        if (existing.rows.length > 0) {

            // UPDATE existing progress
            result = await pool.query(
                `UPDATE learning_progress
                 SET
                    user_id = $1,
                    skill_name = $2,
                    progress = $3,
                    course_completed = $4,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE request_id = $5
                 RETURNING *`,
                [
                    userId,
                    skillName,
                    progress || 0,
                    courseCompleted || false,
                    requestId
                ]
            );

        } else {

            // INSERT new progress
            result = await pool.query(
                `INSERT INTO learning_progress
                (
                    request_id,
                    user_id,
                    skill_name,
                    progress,
                    course_completed
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    requestId,
                    userId,
                    skillName,
                    progress || 0,
                    courseCompleted || false
                ]
            );
        }

        res.json({
            message: "Learning progress saved successfully",
            progress: result.rows[0]
        });

    } catch (error) {

        console.error("SAVE PROGRESS ERROR:", error);

        res.status(500).json({
            message: "Failed to save learning progress",
            error: error.message
        });
    }
});


// ==========================================
// GET LEARNING PROGRESS
// ==========================================
router.get("/progress/:requestId", async (req, res) => {
    try {

        const { requestId } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM learning_progress
             WHERE request_id = $1`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.json({
                progress: null
            });
        }

        res.json({
            progress: result.rows[0]
        });

    } catch (error) {

        console.error("GET PROGRESS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch learning progress",
            error: error.message
        });
    }
});


// ==========================================
// SAVE CERTIFICATE
// ==========================================
router.post("/certificate", async (req, res) => {
    try {

        const {
            requestId,
            userId,
            mentorId,
            skillName,
            score,
            totalQuestions,
            percentage
        } = req.body;

        if (
            !requestId ||
            !userId ||
            !mentorId ||
            !skillName ||
            score === undefined ||
            !totalQuestions ||
            percentage === undefined
        ) {
            return res.status(400).json({
                message: "All certificate details are required"
            });
        }

        // Check whether certificate already exists
        const existing = await pool.query(
            `SELECT *
             FROM certificates
             WHERE request_id = $1`,
            [requestId]
        );

        if (existing.rows.length > 0) {
            return res.json({
                message: "Certificate already exists",
                certificate: existing.rows[0]
            });
        }

        const result = await pool.query(
            `INSERT INTO certificates
            (
                request_id,
                user_id,
                mentor_id,
                skill_name,
                score,
                total_questions,
                percentage
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                requestId,
                userId,
                mentorId,
                skillName,
                score,
                totalQuestions,
                percentage
            ]
        );

        res.status(201).json({
            message: "Certificate saved successfully",
            certificate: result.rows[0]
        });

    } catch (error) {

        console.error("SAVE CERTIFICATE ERROR:", error);

        res.status(500).json({
            message: "Failed to save certificate",
            error: error.message
        });
    }
});


// ==========================================
// GET CERTIFICATE
// ==========================================
router.get("/certificate/:requestId", async (req, res) => {
    try {

        const { requestId } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM certificates
             WHERE request_id = $1`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.json({
                certificate: null
            });
        }

        res.json({
            certificate: result.rows[0]
        });

    } catch (error) {

        console.error("GET CERTIFICATE ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch certificate",
            error: error.message
        });
    }
});


module.exports = router;