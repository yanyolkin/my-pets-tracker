require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verifyConnection } = require("./config/db");
const apiRouter = require("./routes/api.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const http = require("http");
const { initSocket } = require("./config/socket");
const { connectRedis } = require("./config/redis");
const { initCronJobs } = require("./services/cron.service");

const app = express();

const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
          "http://localhost:5173",
          "http://localhost:5500",
          "http://127.0.0.1:5500",
          "http://localhost:8080",
          "http://127.0.0.1:8080",
          "http://localhost:3001",
          "http://localhost",
      ];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/", apiRouter);

app.use((req, res, next) => {
    const err = new Error(`Маршрут ${req.originalUrl} не найден`);
    err.statusCode = 404;
    err.status = "fail";
    next(err);
});

app.use(errorMiddleware);

async function start() {
    try {
        await verifyConnection();
        await connectRedis();
        initSocket(server);
        initCronJobs();
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`The server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error of connection", err.message);
        process.exit(1);
    }
}

start();
