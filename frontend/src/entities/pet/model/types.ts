export interface LocationPoint {
    id: string;
    latitude: number;
    longitude: number;
    createdAt: string; 
    petId: string;
}

export interface PetHistoryPoint {
    id?: string; 
    petId: string;
    latitude: number;
    longitude: number;
    createdAt: string; 
}

export interface Pet {
    id: string;
    name: string;
    type: string;
    breed: string | null;
    age: number;
    trackerId: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    lastPosition?: LocationPoint | null;
}

export interface CreatePetDto {
    name: string;
    type: string;
    breed?: string;
    age: number;
    trackerId?: string;
}

export interface UpdatePetDto {
    name?: string;
    type?: string;
    breed?: string;
    age?: number;
    trackerId?: string | null;
}

export interface PetState {
    pets: Pet[]; 
    activePetId: string | null; 
    historyPoints: LocationPoint[]; 
    isLoading: boolean;
    error: string | null;
}

export interface PetActions {
    fetchPets: () => Promise<void>;
    createPet: (dto: CreatePetDto) => Promise<void>;
    updatePet: (petId: string, dto: UpdatePetDto) => Promise<void>;
    deletePet: (petId: string) => Promise<void>;

    fetchUserPetsByAdmin: (userId: string) => Promise<void>;
    createUserPetByAdmin: (userId: string, dto: CreatePetDto) => Promise<void>;
    updateUserPetByAdmin: (
        userId: string,
        petId: string,
        dto: UpdatePetDto,
    ) => Promise<void>;
    deleteUserPetByAdmin: (userId: string, petId: string) => Promise<void>;

    setActivePetId: (id: string | null) => void;
    fetchPetHistory: (petId: string) => Promise<void>;
    addRealtimePoint: (point: PetHistoryPoint) => void;
    clearPetState: () => void;
}

export type PetStore = PetState & PetActions;
