import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

export async function GET(request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const selectQuery = `
        SELECT id, reviewed_at, rating, comments, libro_isbn, reviewer
        FROM review
    `;
    const [readers] = await connection.query(selectQuery);
    connection.end();
    return NextResponse.json(readers);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const review = await request.json();
        const connection = await mysql.createConnection(connectionParams);
        const insertQuery = `INSERT INTO review
            (rating, comments, libro_isbn, reviewer)
            VALUES (?, ?, ?, ?)`;
        const [reviews] = await connection.query(
            insertQuery,
            [review.rating, review.comments, review.libro_isbn, review.reviewer]);
        connection.end();
        return NextResponse.json({ newReviewId: reviews?.insertId });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
    