const form = document.getElementById("signupForm");

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (name === "" || email === "" || password === "") {
            alert("Please fill all fields.");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        alert("Account created successfully!");

        window.location.href = "dashboard.html";
    });
}