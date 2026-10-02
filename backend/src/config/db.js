const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function verifyConnection() {
    console.log("Checking connection with bd...");
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("The db is accessable");
    } finally {
        client.release();
    }
}

module.exports = { prisma, verifyConnection };
