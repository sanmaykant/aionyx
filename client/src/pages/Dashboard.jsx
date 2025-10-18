import { Button } from "@/components/ui/button";

export function DashboardPage() {
    const logout = () => {
        localStorage.removeItem("access-token")
        window.location.reload()
    }
    return <Button onClick={logout}>Logout</Button>
}
