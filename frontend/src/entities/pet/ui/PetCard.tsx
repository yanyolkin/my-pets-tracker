import { type ReactNode } from "react";
import { type Pet } from "../model/types";
import styles from "./PetCard.module.css";

interface PetCardProps {
    pet: Pet;
    actions?: ReactNode;
    rightTopAction?: ReactNode;
}

export const PetCard = ({ pet, actions, rightTopAction }: PetCardProps) => {
    const hasTracker = Boolean(pet.trackerId);

    return (
        <div className={styles.card}>
            {rightTopAction && (
                <div className={styles.close}>{rightTopAction}</div>
            )}
            <div className={styles.avatarPlaceholder}>
                {pet.name.charAt(0).toUpperCase()}
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{pet.name}</h3>
                <p className={styles.meta}>
                    <span>
                        Вид: <strong>{pet.type}</strong>
                    </span>
                    {pet.breed && (
                        <span>
                            Порода: <strong>{pet.breed}</strong>
                        </span>
                    )}
                </p>
                <p className={styles.age}>
                    Возраст: <strong>{pet.age} лет</strong>
                </p>
                <div className={styles.trackerStatus}>
                    Статус трекера:
                    <span
                        className={hasTracker ? styles.active : styles.inactive}
                    >
                        {hasTracker
                            ? `Подключен (${pet.trackerId})`
                            : "Отсутствует"}
                    </span>
                </div>
            </div>

            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
};
