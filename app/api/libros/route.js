import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    // select from view that is join of libro and author
    const selectQuery = `
        SELECT isbn, title, publication_date, author_name 
        FROM libro_y_escritor
    `;
    const [libros] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(libros);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const libro = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const insertQuery = `CALL insert_libro_con_escritor(?, ?, ?, ?)`;
        const [libros] = await connection.query(
            insertQuery,
            [libro.isbn, libro.title, libro.publication_date, libro.author_name]);
        connection.end();
        return NextResponse.json({ newLibroId: libros?.insertId });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
    