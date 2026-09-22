const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM messages ORDER BY created_at ASC"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Fetch messages error:", error.message);

        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;

        if (!sender_id || !receiver_id || !message || !message.trim()) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO messages
            (sender_id, receiver_id, message)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [sender_id, receiver_id, message.trim()]
        );

        res.status(201).json({
            message: "Message sent successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Send message error:", error.message);

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
});

module.exports = router;