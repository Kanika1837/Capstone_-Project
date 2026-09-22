async function saveUserActivity(activity, learningCourse = null, progress = null) {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        console.log("User not logged in");
        return;
    }

    const user = JSON.parse(storedUser);

    try {
        const response = await fetch(
            `http://localhost:5000/api/users/activity/${user.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Online",
                    current_activity: activity,
                    learning_courses: learningCourse,
                    course_progress: progress
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("Activity saved successfully");
        } else {
            console.log("Activity save failed:", data.message);
        }

    } catch (error) {
        console.log("Backend connection failed:", error.message);
    }
}