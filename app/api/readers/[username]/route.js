import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { username } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM reader WHERE username = ?`;
        const [readers] = await connection.query(deleteQuery, [username]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { username } = await params;
    try {
        const reader = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `CALL update_reader(?, ?, ?, ?)`; 
        const [readers] = await connection.query(updateQuery, 
            [username, reader.username, reader.pw_hash, reader.salt]);
        connection.end();
        return NextResponse.json({ message: readers?.affectedRows > 0 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}