import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { lid, isbn } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM lista_content WHERE lista_id = ? AND libro_isbn = ?`;
        const [listaContents] = await connection.query(deleteQuery, [lid, isbn]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { lid, isbn } = await params;
    try {
        const newListaContent = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `
            UPDATE lista_content SET lista_id = ?, libro_isbn = ?
            WHERE lista_id = ? AND libro_isbn = ?`;
        const [libros] = await connection.query(updateQuery, 
            [newListaContent.lista_id, newListaContent.libro_isbn, lid, isbn]);
        connection.end();
        return NextResponse.json({ message: libros?.affectedRows > 0 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}