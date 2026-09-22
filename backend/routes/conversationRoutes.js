const express = require("express");
const router = express.Router();

const pool = require("../db");

// SEND MESSAGE
router.post("/", async (req, res) => {
    try {
        const {
            requestId,
            senderId,
            receiverId,
            message
        } = req.body;

        if (!requestId || !senderId || !receiverId || !message) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO conversations
            (request_id, sender_id, receiver_id, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                requestId,
                senderId,
                receiverId,
                message
            ]
        );

        res.status(201).json({
            message: "Message sent successfully",
            conversation: result.rows[0]
        });

    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
});


// GET MESSAGES FOR A REQUEST
router.get("/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM conversations
             WHERE request_id = $1
             ORDER BY created_at ASC`,
            [requestId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("GET MESSAGES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
});


module.exports = router;