import { useSessionStore } from "@/entities/session"
import { Button } from "@/shared/ui"

export const LogoutButton = ()=>{
    const {logout} = useSessionStore()
    return <Button onClick={logout}>Выход</Button>
}