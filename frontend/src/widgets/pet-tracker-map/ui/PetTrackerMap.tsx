import { usePetStore } from "@/entities/pet";
import { usePetTracking } from "@/features/track-pet-position";
import { Map } from "@/shared/ui";
import styles from "./PetTrackerMap.module.css";

export const PetTrackerMap = () => {
    const { pets, activePetId, historyPoints, isLoading } = usePetStore();
    const activePet = pets.find((p) => p.id === activePetId);
    usePetTracking(activePetId);

    if (!activePet) {
        return (
            <div className={styles.centeredMessage}>
                <h3>Ошибка инициализации</h3>
                <p>Данные выбранного питомца не найдены.</p>
            </div>
        );
    }

    const polylinePositions = historyPoints.map((p) => [
        p.latitude,
        p.longitude,
    ]) as [number, number][];

    const lastPoint = historyPoints[historyPoints.length - 1];

    const currentLat = lastPoint?.latitude ?? activePet.lastPosition?.latitude;
    const currentLng =
        lastPoint?.longitude ?? activePet.lastPosition?.longitude;

    const center: [number, number] | undefined =
        currentLat !== undefined && currentLng !== undefined
            ? [currentLat, currentLng]
            : undefined;

    const popupContent = (
        <div className={styles.popupContent}>
            <strong>{activePet.name}</strong> <br />
            <span>Порода: {activePet.breed || "Не указана"}</span> <br />
            {lastPoint?.createdAt && (
                <small className={styles.timestamp}>
                    Спутник:
                    {new Date(lastPoint.createdAt).toLocaleTimeString()}
                </small>
            )}
        </div>
    );

    return (
        <Map
            center={center}
            polylinePositions={polylinePositions}
            markerPopupContent={popupContent}
            isLoading={isLoading && historyPoints.length === 0}
        />
    );
};
