import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || (() => {
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
        const libsql = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        })
        const adapter = new PrismaLibSql(libsql)
        return new PrismaClient({ adapter })
    } else {
        return new PrismaClient()
    }
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma