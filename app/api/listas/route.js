import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'

// mySQL connection parameters
// TODO: move this to .env file
let connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'username',
  password: '********',
  database: 'libro_lista'
  }

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = "SELECT id, name, description, created_by FROM lista";
    const [listas] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(listas);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const lista = await request.json();
    const connection = await mysql.createConnection(connectionParams);
    const insertQuery = `INSERT INTO lista 
            (name, description, created_by)
            VALUES
            (?, ?, ?)`;
    const [listas] = await connection.query(
      insertQuery, 
      [lista.name, lista.description, lista.created_by]);
    connection.end();
    return NextResponse.json({ newListaId: listas?.insertId });
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}