import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = `
        SELECT lista_id, reader_username
        FROM lista_followings
    `;
    const [followings] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(followings);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const following = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const insertQuery = `INSERT INTO lista_followings
            (lista_id, reader_username)
            VALUES (?, ?)`;
        const [followings] = await connection.query(
            insertQuery,
            [following.lista_id, following.reader_username]);
        connection.end();
        return NextResponse.json({ newReviewId: followings?.insertId });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
    