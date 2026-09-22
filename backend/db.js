const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "swap_skill",
    password: "kanika",
    port: 5432
});

pool.connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed:", error.message);
    });

module.exports = pool;