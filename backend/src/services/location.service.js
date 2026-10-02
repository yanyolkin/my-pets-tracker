const { prisma } = require("../config/db");
const { redis } = require("../config/redis");
const { notFound, forbidden } = require("../utils/appError");

const SAVE_INTERVAL_MS = 5 * 60 * 1000;

const saveTrackerLocation = async (trackerId, latitude, longitude) => {
    const pet = await prisma.pet.findUnique({
        where: { trackerId },
        select: { id: true },
    });

    if (!pet) {
        throw notFound("Питомец с указанным ID трекера не найден");
    }

    const now = Date.now();
    const isoString = new Date(now).toISOString();

    const latestLocation = {
        petId: pet.id,
        latitude,
        longitude,
        createdAt: isoString,
    };

    await redis.set(
        `pet:latest:${pet.id}`,
        JSON.stringify(latestLocation),
        "EX",
        24 * 60 * 60,
    );

    const lastSaveTime = await redis.get(`pet:last_db_save:${pet.id}`);

    if (!lastSaveTime || now - parseInt(lastSaveTime, 10) >= SAVE_INTERVAL_MS) {
        await prisma.locationLog.create({
            data: {
                petId: pet.id,
                latitude,
                longitude,
                createdAt: new Date(now),
            },
        });

        await redis.set(`pet:last_db_save:${pet.id}`, now);
        console.log(
            `💾 [DB] Сохранена контрольная точка в Postgres для питомца ID: ${pet.id}`,
        );
    }

    return latestLocation;
};

const getPetHistory = async (petId, userId, userRole) => {
    const pet = await prisma.pet.findUnique({
        where: { id: petId },
        select: { ownerId: true },
    });

    if (!pet) {
        throw notFound("Питомец не найден");
    }

    const isOwner =
        String(pet.ownerId).trim().toLowerCase() ===
        String(userId).trim().toLowerCase();

    if (!isOwner && userRole !== "ADMIN") {
        throw forbidden(
            "Доступ запрещен: вы не являетесь владельцем этого питомца",
        );
    }

    const dbHistory = await prisma.locationLog.findMany({
        where: { petId },
        orderBy: { createdAt: "asc" },
    });

    const cachedLatest = await redis.get(`pet:latest:${petId}`);

    if (cachedLatest) {
        const parsedLatest = JSON.parse(cachedLatest);

        const isDuplicate = dbHistory.some(
            (log) =>
                new Date(log.createdAt).getTime() ===
                new Date(parsedLatest.createdAt).getTime(),
        );

        if (!isDuplicate) {
            dbHistory.push({
                id: "cache-latest",
                petId: parsedLatest.petId,
                latitude: parsedLatest.latitude,
                longitude: parsedLatest.longitude,
                createdAt: new Date(parsedLatest.createdAt),
            });
        }
    }

    return dbHistory;
};

module.exports = {
    saveTrackerLocation,
    getPetHistory,
};
