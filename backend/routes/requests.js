const express = require("express");
const router = express.Router();

const pool = require("../db");

// ======================================================
// GET ALL SKILL REQUESTS
// ======================================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                sr.id,
                sr.sender_id,
                sr.receiver_id,
                sr.skill_id,
                sr.status,
                s.skill_name,
                sender.name AS sender_name,
                receiver.name AS receiver_name
             FROM skill_requests sr
             LEFT JOIN skills s
                ON sr.skill_id = s.id
             LEFT JOIN users sender
                ON sr.sender_id = sender.id
             LEFT JOIN users receiver
                ON sr.receiver_id = receiver.id
             ORDER BY sr.id DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get all requests error:", error);

        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
});


// ======================================================
// CREATE SKILL SWAP REQUEST
// ======================================================

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

        if (Number(requesterId) === Number(mentorId)) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        // Find skill
        const skillResult = await pool.query(
            `SELECT id, skill_name
             FROM skills
             WHERE skill_name ILIKE $1
             LIMIT 1`,
            [`%${skillName}%`]
        );

        if (skillResult.rows.length === 0) {
            return res.status(404).json({
                message: "Skill not found in database"
            });
        }

        const skillId = skillResult.rows[0].id;

        // Check duplicate request
        const existingRequest = await pool.query(
            `SELECT *
             FROM skill_requests
             WHERE sender_id = $1
             AND receiver_id = $2
             AND skill_id = $3
             AND status IN ('Pending', 'Accepted')`,
            [
                requesterId,
                mentorId,
                skillId
            ]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(409).json({
                message: "Request already exists",
                request: existingRequest.rows[0]
            });
        }

        // Create request
        const result = await pool.query(
            `INSERT INTO skill_requests
            (
                sender_id,
                receiver_id,
                skill_id,
                status
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                requesterId,
                mentorId,
                skillId,
                "Pending"
            ]
        );

        res.status(201).json({
            message: "Skill swap request sent successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Create request error:", error);

        res.status(500).json({
            message: "Failed to send skill swap request",
            error: error.message
        });
    }
});


// ======================================================
// GET REQUESTS SENT BY A USER
// ======================================================

router.get("/user/:userId", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                sr.id,
                sr.sender_id,
                sr.receiver_id,
                sr.skill_id,
                sr.status,
                s.skill_name,
                u.name AS receiver_name,
                u.email AS receiver_email
             FROM skill_requests sr
             LEFT JOIN skills s
                ON sr.skill_id = s.id
             LEFT JOIN users u
                ON sr.receiver_id = u.id
             WHERE sr.sender_id = $1
             ORDER BY sr.id DESC`,
            [req.params.userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get user requests error:", error);

        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
});


// ======================================================
// GET REQUESTS RECEIVED BY A MENTOR
// ======================================================

router.get("/mentor/:mentorId", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                sr.id,
                sr.sender_id,
                sr.receiver_id,
                sr.skill_id,
                sr.status,
                s.skill_name,
                u.name AS sender_name,
                u.email AS sender_email
             FROM skill_requests sr
             LEFT JOIN skills s
                ON sr.skill_id = s.id
             LEFT JOIN users u
                ON sr.sender_id = u.id
             WHERE sr.receiver_id = $1
             ORDER BY sr.id DESC`,
            [req.params.mentorId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get mentor requests error:", error);

        res.status(500).json({
            message: "Failed to fetch received requests",
            error: error.message
        });
    }
});


// ======================================================
// GET SINGLE REQUEST BY ID
// ======================================================

router.get("/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!/^\d+$/.test(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const result = await pool.query(
            `SELECT
                sr.id,
                sr.sender_id,
                sr.receiver_id,
                sr.skill_id,
                sr.status,
                s.skill_name,
                sender.name AS sender_name,
                sender.email AS sender_email,
                receiver.name AS receiver_name,
                receiver.email AS receiver_email
             FROM skill_requests sr
             LEFT JOIN skills s
                ON sr.skill_id = s.id
             LEFT JOIN users sender
                ON sr.sender_id = sender.id
             LEFT JOIN users receiver
                ON sr.receiver_id = receiver.id
             WHERE sr.id = $1`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        console.log("REQUEST FOUND:", result.rows[0]);

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Get request by ID error:", error);

        res.status(500).json({
            message: "Failed to fetch request",
            error: error.message
        });
    }
});


// ======================================================
// ACCEPT OR REJECT REQUEST
// ======================================================

router.put("/:requestId/status", async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { status, mentorId } = req.body;

        if (!status || !["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Accepted or Rejected"
            });
        }

        if (!mentorId) {
            return res.status(400).json({
                message: "Mentor ID is required"
            });
        }

        const result = await pool.query(
            `UPDATE skill_requests
             SET status = $1
             WHERE id = $2
             AND receiver_id = $3
             AND status = 'Pending'
             RETURNING *`,
            [
                status,
                requestId,
                mentorId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found or already updated"
            });
        }

        res.status(200).json({
            message: `Request ${status.toLowerCase()} successfully`,
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Update request status error:", error);

        res.status(500).json({
            message: "Failed to update request status",
            error: error.message
        });
    }
});


module.exports = router;