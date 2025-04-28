import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { aid } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM author WHERE id = ?`;
        const [authors] = await connection.query(deleteQuery, [aid]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { aid } = await params;
    try {
        const author = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `UPDATE author 
            SET name = ?, main_genre = ? 
            WHERE id = ?`;
        const [authors] = await connection.query(updateQuery, [author.name, author.main_genre, aid]);
        connection.end();
        return NextResponse.json({ message: authors?.affectedRows === 1 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}