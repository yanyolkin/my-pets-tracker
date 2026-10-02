import { PetCard, type Pet } from "@/entities/pet";
import { PetForm } from "@/features/create-pet";
import { DeletePetButton } from "@/features/delete-pet";
import { TrackPetButton } from "@/features/select-active-pet";
import { useModal } from "@/shared/lib/hooks";
import { Button, Modal } from "@/shared/ui";

interface PetCardProps {
    pet: Pet;
    userId?: string;
}

export const PetCardWithModal = ({ userId, pet }: PetCardProps) => {
    const { isOpen, open, close } = useModal(false);
    return (
        <div>
            <PetCard
                pet={pet}
                rightTopAction={
                    <DeletePetButton userId={userId} petId={pet.id} />
                }
                actions={
                    <>
                        <Button onClick={open}>Редактировать</Button>
                        <TrackPetButton
                            petId={pet.id}
                            hasTracker={Boolean(pet.trackerId)}
                        />
                    </>
                }
            />
            <Modal isOpen={isOpen} close={close}>
                <PetForm
                    userId={userId}
                    isOpen={isOpen}
                    pet={pet}
                    onSuccess={close}
                />
            </Modal>
        </div>
    );
};
