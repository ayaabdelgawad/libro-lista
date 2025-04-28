import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { isbn } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM libro WHERE isbn = ?`;
        const [listas] = await connection.query(deleteQuery, [isbn]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { isbn } = await params;
    try {
        const libro = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `CALL update_libro_con_escritor(?, ?, ?, ?)`;
        const [libros] = await connection.query(updateQuery, [isbn, libro.title, libro.publication_date, libro.author_name]);
        connection.end();
        return NextResponse.json({ message: libros?.affectedRows > 0 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}