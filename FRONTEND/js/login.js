document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const message =
        document.getElementById("message") ||
        document.getElementById("passwordError");

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        message.textContent = "";

        if (!email || !password) {
            message.textContent = "Please enter email and password";
            message.style.color = "red";
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.message || "Invalid email or password";

                message.style.color = "red";
                return;
            }

            // Save logged-in user details
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "latestUser",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "userId",
                data.user.id
            );

            message.textContent =
                "Login successful! Redirecting...";

            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);

            message.textContent =
                "Backend connection failed";

            message.style.color = "red";
        }
    });
});