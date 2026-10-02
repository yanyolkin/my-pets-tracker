const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const { notFound, badRequest } = require("../utils/appError");
const { formatUserResponse } = require("./auth.service");

const getAllUsers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [total, users] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return {
        users: users.map(formatUserResponse),
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

const createUser = async (userData) => {
    const { email, password, firstName, lastName, role } = userData;

    const candidate = await prisma.user.findUnique({ where: { email } });
    if (candidate)
        throw badRequest("Пользователь с таким email уже существует");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName: lastName || null,
            role: role || "USER",
        },
    });

    return formatUserResponse(user);
};

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw notFound("Пользователь не найден");
    return formatUserResponse(user);
};

const updateUser = async (id, updateData) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw notFound("Пользователь не найден");

    if (updateData.email && updateData.email !== user.email) {
        const emailCheck = await prisma.user.findUnique({
            where: { email: updateData.email },
        });
        if (emailCheck) throw badRequest("Этот email уже занят");
    }

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
    });

    return formatUserResponse(updatedUser);
};

const deleteUser = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw notFound("Пользователь не найден");

    await prisma.user.delete({ where: { id } });
    return true;
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
