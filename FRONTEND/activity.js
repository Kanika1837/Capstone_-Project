async function updateUserActivity(activity, progress = null, course = null) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        console.log("User not logged in");
        return;
    }

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
                    course_progress: progress,
                    completed_course: course
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("Activity updated:", data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        } else {
            console.log("Activity update failed:", data.message);
        }

    } catch (error) {
        console.log("Activity connection failed:", error.message);
    }
}