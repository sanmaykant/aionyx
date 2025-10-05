const API_URL = "http://localhost:3000/api"

export const scheduleEvent = async (accessToken, eventDetails) => {
    try {
        const response = await fetch(`${API_URL}/scheduler/scheduleEvent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accessToken: accessToken,
                eventDetails: eventDetails
            })
        })

        const responseBody = await response.json()
        if (responseBody.success) {
            return responseBody
        } else {
            throw responseBody
        }
    } catch (error) {
        console.error(error)
    }
}
