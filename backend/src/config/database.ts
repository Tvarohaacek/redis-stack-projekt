import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        throw error;
    }
}

export async function disconnectDatabase() {
    try {
        await prisma.$disconnect();
        console.log('👋 Database disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting database:', error);
    }
}

export default prisma;