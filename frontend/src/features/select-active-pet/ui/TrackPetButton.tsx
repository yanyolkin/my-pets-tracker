import { useLocation, useNavigate } from "react-router-dom";
import { usePetStore } from "@/entities/pet";
import { Button } from "@/shared/ui";

interface TrackPetButtonProps {
    petId: string;
    hasTracker: boolean;
}

export const TrackPetButton = ({ petId, hasTracker }: TrackPetButtonProps) => {
    const navigate = useNavigate();
    const { setActivePetId } = usePetStore();
    const location = useLocation();

    const handleTrack = () => {
        if (!hasTracker) return;
        setActivePetId(petId);
        navigate("/map", { state: { from: location.pathname } });
    };

    if (!hasTracker) {
        return (
            <Button variant="secondary" disabled>
                Нет трекера
            </Button>
        );
    }

    return (
        <Button variant="primary" onClick={handleTrack}>
            Отследить
        </Button>
    );
};
