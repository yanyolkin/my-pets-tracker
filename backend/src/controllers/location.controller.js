const locationService = require("../services/location.service");
const { getIo } = require("../config/socket");

const receiveTrackerData = async (req, res, next) => {
    try {
        const { trackerId, latitude, longitude } = req.body;

        const locationLog = await locationService.saveTrackerLocation(
            trackerId,
            latitude,
            longitude,
        );

        const io = getIo();
        io.to(`pet:${locationLog.petId}`).emit("location_update", {
            petId: locationLog.petId,
            latitude: locationLog.latitude,
            longitude: locationLog.longitude,
            createdAt: locationLog.createdAt,
        });

        res.status(201).json({
            status: "success",
            message: "Location data received and broadcasted",
        });
    } catch (err) {
        next(err);
    }
};

const getPetHistory = async (req, res, next) => {
    try {
        const { petId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;

        const history = await locationService.getPetHistory(
            petId,
            userId,
            userRole,
        );

        res.status(200).json({
            status: "success",
            count: history.length,
            data: history,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    receiveTrackerData,
    getPetHistory,
};
