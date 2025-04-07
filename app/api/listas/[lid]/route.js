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

export async function DELETE(request, { params }) {
    const { lid } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM lista WHERE id = ?`;
        const [listas] = await connection.query(deleteQuery, [lid]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params}) {
    const { lid } = await params;
    try {
        const lista = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `UPDATE lista 
            SET name = ?, description = ?, created_by = ? 
            WHERE id = ?`;
        const [listas] = await connection.query(updateQuery, [lista.name, lista.description, lista.created_by, lid]);
        connection.end();
        return NextResponse.json({ message: listas?.affectedRows === 1 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}