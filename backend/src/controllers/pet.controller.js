const petService = require("../services/pet.service");

const getOwnerId = (req) => {
    return req.params.userId || req.user.userId;
};

const getAllPets = async (req, res, next) => {
    try {
        const ownerId = getOwnerId(req);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { type, breed } = req.query;
        const { pets, pagination } = await petService.getAllPets(
            ownerId,
            page,
            limit,
            { type, breed },
        );

        res.status(200).json({
            status: "success",
            pagination,
            data: { pets },
        });
    } catch (err) {
        next(err);
    }
};

const createPet = async (req, res, next) => {
    try {
        const ownerId = getOwnerId(req);
        const newPet = await petService.createPet(ownerId, req.body);
        res.status(201).json({
            status: "success",
            data: { pet: newPet },
        });
    } catch (err) {
        next(err);
    }
};

const getPetById = async (req, res, next) => {
    try {
        const ownerId = getOwnerId(req);
        const pet = await petService.getPetById(ownerId, req.params.petId);
        res.status(200).json({
            status: "success",
            data: { pet },
        });
    } catch (err) {
        next(err);
    }
};

const updatePet = async (req, res, next) => {
    try {
        const ownerId = getOwnerId(req);
        const updatedPet = await petService.updatePet(
            ownerId,
            req.params.petId,
            req.body,
        );
        res.status(200).json({
            status: "success",
            data: { pet: updatedPet },
        });
    } catch (err) {
        next(err);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const ownerId = getOwnerId(req);
        await petService.deletePet(ownerId, req.params.petId);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllPets,
    createPet,
    getPetById,
    updatePet,
    deletePet,
};
