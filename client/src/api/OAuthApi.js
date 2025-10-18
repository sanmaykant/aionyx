export async function login() {
    try {
        console.log("Making the API request...");
        const res = await fetch('http://localhost:3000/api/auth/oauth/google', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        console.log("In the function");

        const resJson = await res.json();
        console.log(resJson);

        if (resJson.success) {
            console.log(resJson.body);
            return resJson.body;
        } else {
            throw new Error(resJson.error);
        }
    } catch (error) {
        console.log("Error caught:", error);
    }
}
