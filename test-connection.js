/**
 * Standalone Database Connection Test
 * Tests both raw pg and Prisma connections independently.
 * Usage: node test-connection.js
 */

const fs = require('fs');
const path = require('path');

// ── 1. Load .env manually (no dotenv dependency) ──
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found!');
        process.exit(1);
    }
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env');
    process.exit(1);
}

// Mask password for display
const maskedUrl = DATABASE_URL.replace(/:([^@]+)@/, ':****@');
console.log('\n🔍 DATABASE_URL:', maskedUrl);

// Check for hidden characters
const hasHiddenChars = /[\r\u00A0\u200B\uFEFF]/.test(DATABASE_URL);
if (hasHiddenChars) {
    console.error('⚠️  WARNING: Hidden/invisible characters detected in DATABASE_URL!');
    console.log('   Hex dump of first 100 chars:', Buffer.from(DATABASE_URL.substring(0, 100)).toString('hex'));
}

// ── 2. Parse the URL for diagnostics ──
try {
    const url = new URL(DATABASE_URL);
    console.log('\n📋 Parsed Connection Details:');
    console.log('   Protocol:', url.protocol);
    console.log('   Host:', url.hostname);
    console.log('   Port:', url.port || '5432 (default)');
    console.log('   Database:', url.pathname.slice(1));
    console.log('   User:', url.username);
    console.log('   SSL Mode:', url.searchParams.get('sslmode') || 'not set');
} catch (e) {
    console.error('❌ Failed to parse DATABASE_URL:', e.message);
}

// ── 3. DNS Resolution Test ──
async function testDNS() {
    const dns = require('dns').promises;
    const url = new URL(DATABASE_URL);
    console.log('\n🌐 DNS Resolution Test...');
    try {
        const addresses = await dns.resolve4(url.hostname);
        console.log('   ✅ DNS resolved to:', addresses.join(', '));
        return true;
    } catch (e) {
        console.error('   ❌ DNS resolution FAILED:', e.message);
        return false;
    }
}

// ── 4. Raw TCP Connection Test ──
async function testTCP() {
    const net = require('net');
    const url = new URL(DATABASE_URL);
    const host = url.hostname;
    const port = parseInt(url.port) || 5432;

    console.log(`\n🔌 TCP Connection Test (${host}:${port})...`);

    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(10000);

        socket.connect(port, host, () => {
            console.log('   ✅ TCP connection successful!');
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.error('   ❌ TCP connection TIMED OUT (10s)');
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.error('   ❌ TCP connection FAILED:', err.message);
            socket.destroy();
            resolve(false);
        });
    });
}

// ── 5. pg Client Test ──
async function testPG() {
    console.log('\n🐘 pg Client Test...');
    try {
        const { Client } = require('pg');
        const client = new Client({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 15000,
        });

        await client.connect();
        const res = await client.query('SELECT NOW() as now, current_database() as db');
        console.log('   ✅ pg connected successfully!');
        console.log('   Server Time:', res.rows[0].now);
        console.log('   Database:', res.rows[0].db);

        // Check if Lead table exists
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log('\n   📦 Tables found:', tables.rows.length);
        tables.rows.forEach(r => console.log('      -', r.table_name));

        await client.end();
        return true;
    } catch (e) {
        console.error('   ❌ pg connection FAILED:', e.message);
        return false;
    }
}

// ── 6. Prisma Test ──
async function testPrisma() {
    console.log('\n⚡ Prisma Client Test...');
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient({
            datasources: { db: { url: DATABASE_URL } },
        });

        await prisma.$connect();
        const count = await prisma.lead.count();
        console.log('   ✅ Prisma connected successfully!');
        console.log('   Lead count:', count);
        await prisma.$disconnect();
        return true;
    } catch (e) {
        console.error('   ❌ Prisma FAILED:', e.message);
        return false;
    }
}

// ── Run All Tests ──
async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  DATABASE CONNECTION DIAGNOSTIC TOOL');
    console.log('═══════════════════════════════════════════');

    const dnsOk = await testDNS();
    const tcpOk = await testTCP();
    const pgOk = await testPG();
    const prismaOk = await testPrisma();

    console.log('\n═══════════════════════════════════════════');
    console.log('  RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`  DNS Resolution:  ${dnsOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  TCP Connection:  ${tcpOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  pg Driver:       ${pgOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Prisma Client:   ${prismaOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═══════════════════════════════════════════');

    if (!dnsOk) {
        console.log('\n💡 DIAGNOSIS: DNS failed. Your machine cannot resolve the Neon hostname.');
        console.log('   → Check your internet connection / DNS settings / VPN.');
    } else if (!tcpOk) {
        console.log('\n💡 DIAGNOSIS: DNS works but TCP fails. Port 5432 is blocked.');
        console.log('   → Check firewall, ISP restrictions, or corporate proxy.');
    } else if (pgOk && !prismaOk) {
        console.log('\n💡 DIAGNOSIS: pg works but Prisma fails. It is a Prisma config issue.');
        console.log('   → Check schema.prisma previewFeatures / driverAdapters.');
    } else if (!pgOk && !prismaOk) {
        console.log('\n💡 DIAGNOSIS: Both pg and Prisma fail. It is a network/auth issue.');
        console.log('   → Verify DATABASE_URL credentials, or Neon project may be paused.');
    } else {
        console.log('\n💡 All tests passed! The connection is healthy.');
    }
}

main().catch(console.error);
