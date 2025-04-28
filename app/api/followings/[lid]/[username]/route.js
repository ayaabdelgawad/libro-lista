import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { lid, username } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM lista_followings WHERE lista_id = ? AND readrer_username = ?`;
        const [followings] = await connection.query(deleteQuery, [lid, username]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { lid, username } = await params;
    try {
        const following = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `UPDATE lista_followings
            SET lista_id = ?, reader_username = ?
            WHERE lista_id = ? AND reader_username = ?`;
        const [followings] = await connection.query(updateQuery, 
            [following.lista_id, following.reader_username, lid, username]);
        connection.end();
        return NextResponse.json({ message: followings?.affectedRows > 0 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}