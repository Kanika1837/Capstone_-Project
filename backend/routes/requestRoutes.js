const express = require("express");
const router = express.Router();

const pool = require("../db");

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

        // Find skill
        const skillResult = await pool.query(
            `SELECT id, skill_name
             FROM skills
             WHERE LOWER(TRIM(skill_name)) = LOWER(TRIM($1))`,
            [skillName]
        );

        if (skillResult.rows.length === 0) {
            return res.status(404).json({
                message: "Skill not found in database"
            });
        }

        const skill = skillResult.rows[0];

        // Check duplicate request
        const existingRequest = await pool.query(
            `SELECT *
             FROM skill_swap_requests
             WHERE sender_id = $1
             AND receiver_id = $2
             AND skill_id = $3
             AND status IN ('Pending', 'Accepted')`,
            [
                requesterId,
                mentorId,
                skill.id
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
            `INSERT INTO skill_swap_requests
            (
                sender_id,
                receiver_id,
                skill_id,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                'Pending'
            )
            RETURNING *`,
            [
                requesterId,
                mentorId,
                skill.id
            ]
        );

        res.status(201).json({
            message: "Skill swap request sent successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("CREATE REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to create skill swap request",
            error: error.message
        });
    }
});

// ======================================================
// GET ALL REQUESTS
// ======================================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                r.id,
                r.sender_id,
                r.receiver_id,
                r.skill_id,
                r.status,
                s.skill_name,
                sender.name AS sender_name,
                receiver.name AS receiver_name
             FROM skill_swap_requests r
             LEFT JOIN skills s
                ON s.id = r.skill_id
             LEFT JOIN public.users sender
                ON sender.id = r.sender_id
             LEFT JOIN public.users receiver
                ON receiver.id = r.receiver_id
             ORDER BY r.id DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("GET REQUESTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
});

// ======================================================
// GET REQUESTS FOR A USER
// ======================================================

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT
                r.id,
                r.sender_id,
                r.receiver_id,
                r.skill_id,
                r.status,
                s.skill_name,
                sender.name AS sender_name,
                receiver.name AS receiver_name,
                receiver.email AS receiver_email
             FROM skill_swap_requests r
             LEFT JOIN skills s
                ON s.id = r.skill_id
             LEFT JOIN public.users sender
                ON sender.id = r.sender_id
             LEFT JOIN public.users receiver
                ON receiver.id = r.receiver_id
             WHERE r.sender_id = $1
             ORDER BY r.id DESC`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("GET USER REQUESTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch user requests",
            error: error.message
        });
    }
});

// ======================================================
// GET ACCEPTED REQUESTS FOR A USER
// ======================================================

router.get("/accepted/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT
                r.id,
                r.sender_id,
                r.receiver_id,
                r.skill_id,
                r.status,
                s.skill_name,
                sender.name AS sender_name,
                receiver.name AS receiver_name
             FROM skill_swap_requests r
             LEFT JOIN skills s
                ON s.id = r.skill_id
             LEFT JOIN public.users sender
                ON sender.id = r.sender_id
             LEFT JOIN public.users receiver
                ON receiver.id = r.receiver_id
             WHERE r.sender_id = $1
             AND LOWER(r.status) = 'accepted'
             ORDER BY r.id DESC`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("GET ACCEPTED REQUESTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch accepted requests",
            error: error.message
        });
    }
});

// ======================================================
// GET REQUEST BY ID
// ======================================================

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const result = await pool.query(
            `SELECT
                r.id,
                r.sender_id,
                r.receiver_id,
                r.skill_id,
                r.status,
                s.skill_name,
                sender.name AS sender_name,
                sender.email AS sender_email,
                receiver.name AS receiver_name,
                receiver.email AS receiver_email
             FROM skill_swap_requests r
             LEFT JOIN skills s
                ON s.id = r.skill_id
             LEFT JOIN public.users sender
                ON sender.id = r.sender_id
             LEFT JOIN public.users receiver
                ON receiver.id = r.receiver_id
             WHERE r.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        console.log("REQUEST FOUND:", result.rows[0]);

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("GET REQUEST BY ID ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch request",
            error: error.message
        });
    }
});

// ======================================================
// ACCEPT REQUEST
// ======================================================

router.put("/:id/accept", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE skill_swap_requests
             SET status = 'Accepted'
             WHERE id = $1
             AND LOWER(status) = 'pending'
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Pending request not found"
            });
        }

        res.status(200).json({
            message: "Skill swap request accepted",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("ACCEPT REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to accept request",
            error: error.message
        });
    }
});

// ======================================================
// REJECT REQUEST
// ======================================================

router.put("/:id/reject", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE skill_swap_requests
             SET status = 'Rejected'
             WHERE id = $1
             AND LOWER(status) = 'pending'
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Pending request not found"
            });
        }

        res.status(200).json({
            message: "Skill swap request rejected",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("REJECT REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to reject request",
            error: error.message
        });
    }
});

module.exports = router;