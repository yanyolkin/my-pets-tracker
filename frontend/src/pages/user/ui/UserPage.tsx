import { Profile } from "@/entities/session";
import { PetForm } from "@/features/create-pet";
import { useModal } from "@/shared/lib/hooks";
import { Button, Modal } from "@/shared/ui";
import { MyPetsList } from "@/widgets/my-pets-list";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./UserPage.module.css";

export const UserPage = () => {
    const { userId } = useParams();
    const location = useLocation();
    const { isOpen, open, close } = useModal(false);
    const navigate = useNavigate();
    const user = location.state?.user ? location.state.user : null;
    console.log(user);
    return (
        <section className={styles.page}>
            <h1 className={styles.title}>Профиль пользователя</h1>
            <div className={styles.profile}>
                {user && (
                    <Profile
                        user={user}
                        actions={
                            <>
                                <Button onClick={open}>Создать питомца</Button>
                                <Button
                                    onClick={() => navigate("/admin")}
                                    variant="secondary"
                                >
                                    Панель администратора
                                </Button>
                            </>
                        }
                    />
                )}
                <Modal isOpen={isOpen} close={close}>
                    <PetForm
                        isOpen={isOpen}
                        onSuccess={close}
                        userId={userId}
                    />
                </Modal>
            </div>
            <div className={styles.pets}>
                <h2>Список питомцев</h2>
                <MyPetsList userId={userId} />
            </div>
        </section>
    );
};
