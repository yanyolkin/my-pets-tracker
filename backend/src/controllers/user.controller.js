const userService = require("../services/user.service");

const getAllUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { users, pagination } = await userService.getAllUsers(
            page,
            limit,
        );

        res.status(200).json({
            status: "success",
            pagination,
            data: { users },
        });
    } catch (err) {
        next(err);
    }
};

const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({
            status: "success",
            data: { user: newUser },
        });
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(
            req.params.id,
            req.body,
        );
        res.status(200).json({
            status: "success",
            data: { user: updatedUser },
        });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
