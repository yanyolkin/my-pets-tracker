const bcrypt = require("bcrypt");
const {prisma} = require("../src/config/db");

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword =
        process.env.ADMIN_PASSWORD || "SuperSecretPassword123";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                firstName: "Admin",
                lastName: "System",
                role: "ADMIN",
            },
        });

        console.log(`✅ Admin user created with email: ${admin.email}`);
    } else {
        console.log("ℹ️ Admin user already exists. Skipping...");
    }
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
