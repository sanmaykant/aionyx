const API_URL = "http://localhost:3000/api"

export const authenticateGoogleOAuthUser = async credential => {
    try {
        const response = await fetch(`${API_URL}/auth/oauth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                credential: credential
            })
        })

        const responseBody = await response.json()
        if (responseBody.success) {
            return responseBody.user
        } else {
            throw responseBody
        }
    } catch (error) {
        console.error(error)
    }
}

export const retrieveGoogleAuthUri = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/oauth/google/authuri`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })

        const responseBody = await response.json()
        if (responseBody.success) {
            return responseBody.url
        } else {
            throw responseBody
        }
    } catch (error) {
        console.error(error)
    }
}
