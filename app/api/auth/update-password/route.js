import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
let connectionParams = GetDBParams();

export async function POST(request) {
    try {
        const connection = await mysql.createConnection(connectionParams);
        // check if password matches
        const creds = await request.json();
        const query = `SELECT pw_hash, salt from reader where username = ?`;
        const [hash_info] = await connection.query(
            query,
            [creds.username]);
            
            if (hash_info[0]) {
                const hash = "$2b$" + SALT_ROUNDS + "$" + hash_info[0].salt + hash_info[0].pw_hash;
                const compare = await bcrypt.compare(creds.password, hash);
                if (compare) {
                    const hash = await bcrypt.hash(creds.password, SALT_ROUNDS);
                    const newPwHash = hash.slice(-31);
                    const newSalt = hash.slice(-53, -31);
                    const updateQuery = `UPDATE reader 
                        SET pw_hash = ?, salt = ?
                        WHERE username = ?`;
                    const [readers] = await connection.query(updateQuery, [newPwHash, newSalt, creds.username]);
                    connection.end();
                    const response = NextResponse.json({success: true}, {status: 200});
                    return response;
                } else {
                    return NextResponse.json({ error: 'Invalid credentials.' }, {status: 401}) 
                }
            } else {
                return NextResponse.json({ error: 'Invalid username.' }, {status: 401}) 
        }
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
