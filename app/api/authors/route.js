import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = `
        SELECT id, name, main_genre
        FROM author
    `;
    const [authors] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const author = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const insertQuery = `INSERT INTO 
          author(name, main_genre) 
          VALUES(?, ?)`;
        const [authors] = await connection.query(
            insertQuery,
            [author.name, author.main_genre]);
        connection.end();
        return NextResponse.json({ newAuthorId: authors?.insertId });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
    