import type { ReactNode } from "react";
import type { User } from "../../model/types";
import styles from "./Profile.module.css";

interface ProfileProps {
    user: User;
    actions?: ReactNode;
}

export function Profile({ user, actions }: ProfileProps) {
    return (
        <div>
            <h2 className={styles.title}>
                Имя:{" "}
                <strong>
                    {user.firstName} {user.lastName}
                </strong>
            </h2>
            <p className={styles.email}>
                Email: <strong>{user.email}</strong>
            </p>
            <p className={styles.role}>
                Роль: <strong>{user.role}</strong>
            </p>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
