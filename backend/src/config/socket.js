const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { prisma } = require("./db");

let io = null;

function initSocket(httpServer) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : [
              "http://localhost:5173",
              "http://localhost:5500",
              "http://127.0.0.1:5500",
              "http://localhost:8080",
              "http://127.0.0.1:8080",
              "http://localhost:3001",
          ];

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
            methods: ["GET", "POST"],
            transports: ["websocket"],
        },
    });

    io.use((socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;

            console.log("--------------------------------------------------");
            console.log(
                "[Socket Auth] Сырой заголовок Cookie от браузера:",
                cookieHeader,
            );
            console.log("--------------------------------------------------");

            if (!cookieHeader) {
                return next(new Error("Authentication error: Cookies missing"));
            }

            const cookies = {};
            cookieHeader.split(";").forEach((cookie) => {
                const [key, value] = cookie.split("=");
                if (key && value) {
                    cookies[key.trim()] = value.trim();
                }
            });

            const accessToken = cookies.accessToken;

            console.log(
                "[Socket Auth] Результат поиска токена:",
                accessToken ? "НАЙДЕН" : "НЕ НАЙДЕН (undefined)",
            );

            if (!accessToken) {
                return next(
                    new Error(
                        "Authentication error: Access token missing in cookies",
                    ),
                );
            }

            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_SECRET,
            );
            socket.user = decoded;
            next();
        } catch (err) {
            console.error(
                "[Socket Auth] Ошибка валидации токена:",
                err.message,
            );
            return next(
                new Error("Authentication error: Invalid or expired token"),
            );
        }
    });

    io.on("connection", (socket) => {
        console.log(
            `[Socket] Авторизованный клиент подключился: ${socket.id} (User: ${socket.user.id}, Role: ${socket.user.role})`,
        );

        socket.on("join_pet_room", async ({ petId }) => {
            try {
                if (!petId) return;

                if (socket.user.role !== "ADMIN") {
                    const pet = await prisma.pet.findFirst({
                        where: { id: petId, ownerId: socket.user.id },
                        select: { id: true },
                    });

                    if (!pet) {
                        console.warn(
                            `[Socket] Отклонено: Пользователь ${socket.user.id} пытался получить доступ к чужому питомцу ${petId}`,
                        );
                        socket.emit("error", {
                            message:
                                "У вас нет прав для отслеживания этого питомца",
                        });
                        return;
                    }
                }

                socket.join(`pet:${petId}`);
                console.log(
                    `[Socket] Клиент ${socket.id} успешно подписался на питомца: ${petId}`,
                );
            } catch (error) {
                console.error(
                    "[Socket] Ошибка при обработке join_pet_room:",
                    error,
                );
            }
        });

        socket.on("leave_pet_room", ({ petId }) => {
            if (petId) {
                socket.leave(`pet:${petId}`);
                console.log(
                    `[Socket] Клиент ${socket.id} покинул комнату питомца: ${petId}`,
                );
            }
        });

        socket.on("disconnect", () => {
            console.log(`[Socket] Клиент отключился: ${socket.id}`);
        });
    });

    return io;
}

function getIo() {
    if (!io) {
        throw new Error(
            "Socket.io не был инициализирован! Сначала вызовите initSocket.",
        );
    }
    return io;
}

module.exports = {
    initSocket,
    getIo,
};
