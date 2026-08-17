const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    alert("Login successful!");

    window.location.href = "dashboard.html";
});