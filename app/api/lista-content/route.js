import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = "SELECT lista_id, libro_isbn from lista_content";
    const [listaContent] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(listaContent);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const listaContent = await request.json();
    const connection = await mysql.createConnection(connectionParams);
    const insertQuery = `INSERT INTO lista_content
            (lista_id, libro_isbn) 
            VALUES
            (?, ?)`;
    const [listaContents] = await connection.query(
      insertQuery, 
      [listaContent.lista_id, listaContent.libro_isbn]);
    connection.end();
    return NextResponse.json({ newListaId: listaContents?.insertId });
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}