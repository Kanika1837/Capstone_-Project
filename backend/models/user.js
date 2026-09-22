const pool = require("../db");

// Get all users
const getAllUsers = async () => {
    try {
        const result = await pool.query(
            "SELECT id, name, email FROM public.users ORDER BY id DESC"
        );

        return result.rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Get user by email
const getUserByEmail = async (email) => {
    try {
        const result = await pool.query(
            "SELECT * FROM public.users WHERE email = $1",
            [email]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

// Get mentors by teaching skill
const getMentorsBySkill = async (skill) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, teaching_skills, status
             FROM public.users
             WHERE teaching_skills ILIKE $1`,
            [`%${skill}%`]
        );

        return result.rows;
    } catch (error) {
        console.error("Error fetching mentors:", error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserByEmail,
    getMentorsBySkill
};