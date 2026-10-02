import {
    UserCard,
    useUserActions,
    useUserError,
    useUserLoading,
    useUsers,
} from "@/entities/user";
import { Button } from "@/shared/ui";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";

export const AdminPage = () => {
    const navigate = useNavigate();
    const users = useUsers();
    const isLoading = useUserLoading();
    const error = useUserError();

    const { loadUsers } = useUserActions();
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    if (isLoading) {
        return <p>Загрузка... Пожалуйста, ждите...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    return (
        <section className={styles.panel}>
            <h1 className={styles.title}>Панель администратора</h1>
            <Button onClick={() => navigate("/")}>Вернуться в профиль</Button>
            <h2>Список пользователей</h2>
            <div className={styles.users}>
                {users.map((user) => (
                    <Link
                        
                        key={user.id}
                        to={`/user/${user.id}`}
                        state={{ user }}
                    >
                        <UserCard user={user} />
                    </Link>
                ))}
            </div>
        </section>
    );
};
