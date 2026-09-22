document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const passwordCondition = document.getElementById("passwordCondition");
    const confirmCondition = document.getElementById("confirmCondition");
    const message = document.getElementById("message");


    // Password validation
    passwordInput.addEventListener("input", function () {

        const password = passwordInput.value;

        const hasLength = password.length >= 6;
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (hasLength && hasNumber && hasSpecial) {
            passwordCondition.innerText = "✓ Strong password";
            passwordCondition.style.color = "green";
        } else {
            passwordCondition.innerText =
                "Password must contain 6+ characters, one number and one special character.";

            passwordCondition.style.color = "#777";
        }
    });


    // Confirm password validation
    confirmPasswordInput.addEventListener("input", function () {

        if (
            confirmPasswordInput.value !== "" &&
            confirmPasswordInput.value === passwordInput.value
        ) {
            confirmCondition.innerText = "✓ Passwords match";
            confirmCondition.style.color = "green";
        } else {
            confirmCondition.innerText = "Passwords do not match";
            confirmCondition.style.color = "red";
        }
    });


    // Signup form submit
    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        // Basic validation
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            message.innerText = "Please fill all fields.";
            message.style.color = "red";
            return;
        }


        // Password validation
        if (
            password.length < 6 ||
            !/[0-9]/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
        ) {
            message.innerText =
                "Password must contain 6+ characters, one number and one special character.";

            message.style.color = "red";
            return;
        }


        // Confirm password validation
        if (password !== confirmPassword) {
            message.innerText = "Passwords do not match.";
            message.style.color = "red";
            return;
        }


        message.innerText = "Creating account...";
        message.style.color = "#172b4d";


        try {

            const response = await fetch(
                "http://localhost:5000/api/users/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                message.innerText = "Signup successful! Redirecting to login...";
                message.style.color = "green";

                signupForm.reset();

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);

            } else {

                message.innerText =
                    data.message || "Signup failed. Please try again.";

                message.style.color = "red";
            }

        } catch (error) {

            console.error("Signup error:", error);

            message.innerText =
                "Backend connection failed. Please start the backend server.";

            message.style.color = "red";
        }

    });

});