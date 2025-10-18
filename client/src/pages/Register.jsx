import { login } from "@/api/OAuthApi"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"

export function RegisterPage() {
    const navigate = useNavigate()
    const [ searchParams ] = useSearchParams()
    const accessToken = searchParams.get("accessToken")

    const handleRegister = async () => {
        const { url } = await login()
        window.location.href = url
    }
    
    useEffect(() => {
        if (!accessToken) {
            return
        }

        localStorage.setItem("access-token", accessToken)
        navigate("/dashboard")
    })

    return <Button onClick={handleRegister}>Register</Button>
}
