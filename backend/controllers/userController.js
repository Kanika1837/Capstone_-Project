const User = require("../models/user");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Account not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                teaching_skills: user.teaching_skills
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// Get mentors based on teaching skill
const getMentorsBySkill = async (req, res) => {
    try {
        const { skill } = req.params;

        if (!skill) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        const mentors = await User.getMentorsBySkill(skill);

        if (!mentors || mentors.length === 0) {
            return res.status(404).json({
                message: "Skills not found in database"
            });
        }

        res.status(200).json(mentors);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch mentors",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    loginUser,
    getMentorsBySkill
};