import type { ReactNode } from "react";
import { type User } from "../model/types";
import styles from "./UserCard.module.css";

interface UserCardProps {
    user: User;
    actions?: ReactNode;
}

export const UserCard = ({ user, actions }: UserCardProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    Имя:{" "}
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>
                </h3>
                <p className={styles.text}>
                    Роль: <strong>{user.role}</strong>
                </p>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
};
