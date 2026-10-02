const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { prisma } = require("../config/db");
const { unauthorized, notFound } = require("../utils/appError");

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
    );
    return { accessToken, refreshToken };
};

const formatUserResponse = (user) => {
    const { password, ...cleanUser } = user;
    return cleanUser;
};

const register = async (userData) => {
    const { email, password, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName: lastName || null,
            role: "USER",
        },
    });

    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
        data: {
            token: hashToken(tokens.refreshToken),
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return { user: formatUserResponse(user), ...tokens };
};

const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw unauthorized("Неверный email или пароль");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw unauthorized("Неверный email или пароль");

    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
        data: {
            token: hashToken(tokens.refreshToken),
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return { user: formatUserResponse(user), ...tokens };
};

const logout = async (refreshToken) => {
    if (!refreshToken) return;
    const hashed = hashToken(refreshToken);
    await prisma.refreshToken.deleteMany({ where: { token: hashed } });
};

const refresh = async (refreshToken) => {
    if (!refreshToken) throw unauthorized("Сессия истекла");

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw unauthorized("Невалидный рефреш токен");
    }

    const hashed = hashToken(refreshToken);
    const dbToken = await prisma.refreshToken.findUnique({
        where: { token: hashed },
        include: { user: true },
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
        if (dbToken)
            await prisma.refreshToken.delete({ where: { id: dbToken.id } });
        throw unauthorized("Сессия истекла или токен отозван");
    }

    await prisma.refreshToken.delete({ where: { id: dbToken.id } });

    const tokens = generateTokens(dbToken.user);

    await prisma.refreshToken.create({
        data: {
            token: hashToken(tokens.refreshToken),
            userId: dbToken.user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return { user: formatUserResponse(dbToken.user), ...tokens };
};

const verifyMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            pets: true,
        },
    });

    if (!user) throw notFound("Пользователь не найден");

    const { password, pets, ...cleanUser } = user;

    const lightPets = pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
    }));

    return {
        ...cleanUser,
        pets: lightPets,
    };
};

const revokeUserTokens = async (userId) => {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw notFound("Пользователь не найден");

    const deleteResult = await prisma.refreshToken.deleteMany({
        where: { userId },
    });

    return {
        success: true,
        revokedCount: deleteResult.count,
    };
};

module.exports = {
    register,
    login,
    logout,
    refresh,
    verifyMe,
    formatUserResponse,
    revokeUserTokens,
};
