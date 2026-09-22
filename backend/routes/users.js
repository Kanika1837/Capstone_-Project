const express = require("express");
const router = express.Router();

const pool = require("../db");


// =====================================================
// GET ALL USERS - ADMIN
// =====================================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                email,
                role,
                status,
                current_activity,
                last_active,
                course_progress,
                completed_course,
                teaching_skills,
                learning_skills
            FROM users
            ORDER BY id DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});


// =====================================================
// USER SIGNUP
// =====================================================

router.post("/signup", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const result = await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                role,
                status,
                current_activity,
                last_active,
                course_progress,
                completed_course,
                teaching_skills,
                learning_skills
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8, $9, $10)
            RETURNING
                id,
                name,
                email,
                role,
                status,
                current_activity,
                last_active,
                course_progress,
                completed_course,
                teaching_skills,
                learning_skills`,
            [
                name,
                email,
                password,
                role || "user",
                "Offline",
                "Not started",
                0,
                0,
                "",
                ""
            ]
        );

        res.status(201).json({
            message: "Signup successful",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Signup failed",
            error: error.message
        });
    }
});


// =====================================================
// USER LOGIN
// =====================================================

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                password,
                role,
                status,
                current_activity,
                last_active,
                course_progress,
                completed_course,
                teaching_skills,
                learning_skills
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const updatedUser = await pool.query(
            `UPDATE users
             SET status = $1,
                 current_activity = $2,
                 last_active = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING
                 id,
                 name,
                 email,
                 role,
                 status,
                 current_activity,
                 last_active,
                 course_progress,
                 completed_course,
                 teaching_skills,
                 learning_skills`,
            [
                "Online",
                "Browsing skills",
                user.id
            ]
        );

        res.json({
            message: "Login successful",
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// =====================================================
// GET USER PROFILE BY ID
// =====================================================

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                status,
                current_activity,
                last_active,
                course_progress,
                completed_course,
                teaching_skills,
                learning_skills
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE USER ACTIVITY
// =====================================================

router.put("/activity/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const {
            current_activity,
            course_progress,
            completed_course
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET current_activity = $1,
                 course_progress = $2,
                 completed_course = $3,
                 last_active = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING
                 id,
                 name,
                 email,
                 role,
                 status,
                 current_activity,
                 last_active,
                 course_progress,
                 completed_course,
                 teaching_skills,
                 learning_skills`,
            [
                current_activity || "Learning",
                course_progress || 0,
                completed_course || 0,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Activity updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Activity update error:", error);

        res.status(500).json({
            message: "Failed to update activity",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE TEACHING AND LEARNING SKILLS
// =====================================================

router.put("/skills/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const {
            teachingSkills,
            learningSkills
        } = req.body;

        const teachingSkillsText = Array.isArray(teachingSkills)
            ? teachingSkills.join(", ")
            : "";

        const learningSkillsText = Array.isArray(learningSkills)
            ? learningSkills.join(", ")
            : "";

        const result = await pool.query(
            `UPDATE users
             SET teaching_skills = $1,
                 learning_skills = $2,
                 last_active = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING
                 id,
                 name,
                 email,
                 role,
                 status,
                 current_activity,
                 last_active,
                 course_progress,
                 completed_course,
                 teaching_skills,
                 learning_skills`,
            [
                teachingSkillsText,
                learningSkillsText,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Skills saved successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Skills update error:", error);

        res.status(500).json({
            message: "Failed to save skills",
            error: error.message
        });
    }
});


// =====================================================
// FIND MENTORS BY TEACHING SKILL
// =====================================================

router.get("/mentors/:skill", async (req, res) => {
    try {
        const skill = req.params.skill.trim();

        if (!skill) {
            return res.status(400).json({
                message: "Skill name is required"
            });
        }

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                status,
                teaching_skills
             FROM users
             WHERE teaching_skills IS NOT NULL
             AND teaching_skills <> ''
             AND EXISTS (
                 SELECT 1
                 FROM unnest(string_to_array(teaching_skills, ',')) AS skill_item
                 WHERE LOWER(TRIM(skill_item)) = LOWER(TRIM($1))
             )
             ORDER BY name ASC`,
            [skill]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Mentor search error:", error);

        res.status(500).json({
            message: "Failed to fetch mentors",
            error: error.message
        });
    }
});


// =====================================================
// USER LOGOUT
// =====================================================

router.put("/logout/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            `UPDATE users
             SET status = $1,
                 current_activity = $2,
                 last_active = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING
                 id,
                 name,
                 email,
                 role,
                 status,
                 current_activity,
                 last_active,
                 course_progress,
                 completed_course,
                 teaching_skills,
                 learning_skills`,
            [
                "Offline",
                "Logged out",
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Logout successful",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;