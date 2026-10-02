const { prisma } = require("../config/db");
const { notFound } = require("../utils/appError");

const getAllPets = async (ownerId, page = 1, limit = 10, filters = {}) => {
    const skip = (page - 1) * limit;
    const whereCondition = { ownerId };
    if (filters.type) {
        whereCondition.type = {
            contains: filters.type,
            mode: "insensitive",
        };
    }
    if (filters.breed) {
        whereCondition.breed = {
            contains: filters.breed,
            mode: "insensitive",
        };
    }

    const [total, pets] = await prisma.$transaction([
        prisma.pet.count({ where: whereCondition }),
        prisma.pet.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
    ]);
    return {
        pets,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

const createPet = async (ownerId, petData) => {
    const userExists = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!userExists) throw notFound("Указанный владелец не найден");

    return await prisma.pet.create({
        data: {
            ...petData,
            ownerId,
        },
    });
};

const getPetById = async (ownerId, petId) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, ownerId },
    });
    if (!pet) throw notFound("Питомец не найден у данного пользователя");
    return pet;
};

const updatePet = async (ownerId, petId, updateData) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, ownerId },
    });
    if (!pet) throw notFound("Питомец не найден у данного пользователя");

    return await prisma.pet.update({
        where: { id: petId },
        data: updateData,
    });
};

const deletePet = async (ownerId, petId) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, ownerId },
    });
    if (!pet) throw notFound("Питомец не найден у данного пользователя");

    await prisma.pet.delete({ where: { id: petId } });
    return true;
};

module.exports = {
    getAllPets,
    createPet,
    getPetById,
    updatePet,
    deletePet,
};
