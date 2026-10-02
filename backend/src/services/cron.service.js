const cron = require("node-cron");
const { prisma } = require("../config/db");

const initCronJobs = () => {
    console.log("⏰ [Cron] Инициализация планировщика задач...");

    cron.schedule("0 * * * *", async () => {
        console.log(
            "🧹 [Cron] Запуск ежечасной очистки координат старше 24 часов...",
        );
        try {
            const twentyFourHoursAgo = new Date(
                Date.now() - 24 * 60 * 60 * 1000,
            );

            const result = await prisma.locationLog.deleteMany({
                where: {
                    createdAt: {
                        lt: twentyFourHoursAgo,
                    },
                },
            });

            console.log(
                `🗑️ [Cron] Очистка базы завершена. Удалено устаревших записей: ${result.count}`,
            );
        } catch (error) {
            console.error(
                "❌ [Cron] Ошибка при выполнении очистки координат:",
                error,
            );
        }
    });
};

module.exports = {
    initCronJobs,
};
