import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function DELETE(request, { params }) {
    const { rid } = await params;
    try {
        const connection = await mysql.createConnection(connectionParams);
        const deleteQuery = `DELETE FROM review WHERE id = ?`;
        const [reviews] = await connection.query(deleteQuery, [rid]);
        connection.end();
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { rid } = await params;
    try {
        const review = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const updateQuery = `UPDATE review 
            SET rating = ?, comments = ?, libro_isbn = ?, reviewer = ?
            WHERE id = ?`;
        const [reviews] = await connection.query(updateQuery, 
            [review.rating, review.comments, review.libro_isbn, review.reviewer, rid]);
        connection.end();
        return NextResponse.json({ message: reviews?.affectedRows === 1 ? "success" : "failed" });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}