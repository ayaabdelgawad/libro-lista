import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';
import { serialize } from 'cookie';

let connectionParams = GetDBParams();

export async function POST(req) {
    try {
        const reader = await req.json();
        const connection = await mysql.createConnection(connectionParams);
        const insertQuery = `INSERT INTO reader
            (username, pw_hash, salt)
            VALUES (?, ?, ?)`;
        const [readers] = await connection.query(
            insertQuery,
            [reader.username, reader.pw_hash, reader.salt]);
        connection.end();
        const cookie = serialize('username', reader.username, {
            path: '/',
          });
        const response = NextResponse.json({success: true, redirectTo: '/'}, {status: 200});
        response.headers.set('Set-Cookie', cookie);
        return response;
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
    }
}