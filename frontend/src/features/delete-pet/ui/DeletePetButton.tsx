import { usePetStore } from "@/entities/pet";
import { CloseButton } from "@/shared/ui";

export const DeletePetButton = ({
    petId,
    userId,
}: {
    petId: string;
    userId?: string;
}) => {
    const { deletePet, deleteUserPetByAdmin } = usePetStore();
    if (userId) {
        return (
            <CloseButton onClick={() => deleteUserPetByAdmin(userId, petId)} />
        );
    }
    return <CloseButton onClick={() => deletePet(petId)} />;
};
