import activities from "@/components/activities";

export const scheduleApi = async (access_token, activity) => {
    console.log(activity);
    try {
    const res = await fetch('http://localhost:3000/api/schedule', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accessToken: access_token,
                eventDetails: activity
            })
    });

    const resJson = await res.json();
    console.log(resJson);

        if (resJson.success) {
            console.log(resJson.body);
            return resJson;
        } else {
            throw new Error(resJson.error);
        }
    }catch (error) {
        console.log("Error caught:", error);
    }
}