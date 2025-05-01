import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = `
        SELECT username
        FROM reader
    `;
    const [readers] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(readers);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
    