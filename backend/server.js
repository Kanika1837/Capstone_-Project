const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const requestsRoutes = require("./routes/requests");
const conversationRoutes = require("./routes/conversationRoutes");
const learningRoutes = require("./routes/learningRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());


// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
    res.send("Swap Skill Backend is Running!");
});


// ==========================================
// USERS API
// ==========================================
app.use("/api/users", usersRoutes);


// ==========================================
// SKILL REQUESTS API
// ==========================================
app.use("/api/requests", requestsRoutes);


// ==========================================
// CONVERSATION API
// ==========================================
app.use("/api/conversations", conversationRoutes);


// ==========================================
// LEARNING API
// ==========================================
app.use("/api/learning", learningRoutes);


// ==========================================
// START SERVER
// ==========================================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});