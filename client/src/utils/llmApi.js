const API_URL = "http://localhost:3000/api"

export const retrieveActivities = async text => {
    try {
        const response = await fetch(`${API_URL}/llm/identifyActivities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text
            })
        })

        const data = await response.json()
        if (data.success) {
            return data.activities
        } else {
            throw data
        }
    } catch (error) {
        console.error(error)
    }
}
