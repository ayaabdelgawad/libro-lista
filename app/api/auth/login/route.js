import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const SALT_ROUNDS = 10;

let connectionParams = GetDBParams();

export async function POST(req) {
    try {
        const creds = await req.json();
        const connection = await mysql.createConnection(connectionParams);
        const query = `SELECT pw_hash, salt from reader where username = ?`;
        const [hash_info] = await connection.query(
            query,
            [creds.username]);
        connection.end();

        if (hash_info[0]) {
            const hash = "$2b$" + SALT_ROUNDS + "$" + hash_info[0].salt + hash_info[0].pw_hash;
            const compare = await bcrypt.compare(creds.password, hash);
            if (compare) {
                const cookie = serialize('username', creds.username, {
                    path: '/',
                });
                const response = NextResponse.json({success: true, redirectTo: '/'}, {status: 200});
                response.headers.set('Set-Cookie', cookie);
                return response;
            } else {
                return NextResponse.json({ error: 'Invalid credentials.' }, {status: 401}) 
            }
        } else {
            return NextResponse.json({ error: 'Invalid credentials.' }, {status: 401}) 
        }
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
    