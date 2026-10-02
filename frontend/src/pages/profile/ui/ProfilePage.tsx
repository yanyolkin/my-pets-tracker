import { useSessionStore, Profile } from "@/entities/session";
import { MyPetsList } from "@/widgets/my-pets-list";
import styles from "./ProfilePage.module.css";
import { LogoutButton } from "@/features/logout";
import { CheckAdmin } from "@/features/check-admin";
import { Button, Modal } from "@/shared/ui";
import { PetForm } from "@/features/create-pet";
import { useModal } from "@/shared/lib/hooks";

export const ProfilePage = () => {
    const { user } = useSessionStore();
    const { isOpen, open, close } = useModal(false);

    if (!user) return null;

    return (
        <div className={styles.container}>
            <section className={styles.profileSection}>
                <Profile
                    user={user}
                    actions={
                        <>
                            <LogoutButton />
                            <CheckAdmin role={user.role} />
                            <Button onClick={open}>Добавить питомца</Button>
                        </>
                    }
                />
                <Modal isOpen={isOpen} close={close}>
                    <PetForm isOpen={isOpen} onSuccess={close} />
                </Modal>
            </section>

            <section className={styles.petsSection}>
                <h2 className={styles.title}>Мои питомцы</h2>
                <MyPetsList />
            </section>
        </div>
    );
};
