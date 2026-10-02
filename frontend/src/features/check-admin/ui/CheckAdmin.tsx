import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

export const CheckAdmin = ({ role }: { role: "ADMIN" | "USER" }) => {
    const isAdmin = role === "ADMIN";
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/admin");
    };
    return (
        isAdmin && (
            <Button variant="secondary" onClick={handleClick}>
                Панель администратора
            </Button>
        )
    );
};
