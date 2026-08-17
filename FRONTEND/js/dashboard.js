const searchButton = document.querySelector("button");
const searchInput = document.querySelector("input");

searchButton.addEventListener("click", function () {
    const skill = searchInput.value.trim();

    if (skill === "") {
        alert("Please enter a skill to search.");
        return;
    }

    alert("Searching for: " + skill);
});