import mysql from  'mysql2/promise';
import { NextResponse, NextRequest } from 'next/server'
import { GetDBParams } from '@/next.config.mjs';

let connectionParams = GetDBParams();

const LIMIT = 5;

export async function GET(req) {
    try {
        const connection = await mysql.createConnection(connectionParams);
        // get the most popular books from this week
        const topRatedBooksOfTheWeekQuery = `
            SELECT
                isbn, 
                title,
                author.name AS author_name,
                AVG(rating) AS average_rating
            FROM
                review 
            INNER JOIN 
                libro
            ON 
                review.libro_isbn = libro.isbn
            INNER JOIN 
                author
            ON
                libro.author_id = author.id
            WHERE
                reviewed_at >= NOW() - INTERVAL 1 WEEK
            GROUP BY
                libro_isbn
            ORDER BY
                average_rating DESC
            LIMIT ${LIMIT};
        `;
        const [topRatedBooksOfTheWeek] = await connection.query(topRatedBooksOfTheWeekQuery);

        // get the most reviewed books of the week
        const mostReviewedBooksOfTheWeekQuery = `
            SELECT
                isbn, 
                title,
                author.name AS author_name,
                COUNT(rating) AS rating_count
            FROM
                review 
            INNER JOIN 
                libro
             ON 
                review.libro_isbn = libro.isbn
            INNER JOIN 
                author
            ON
                libro.author_id = author.id
            WHERE
                reviewed_at >= NOW() - INTERVAL 1 WEEK
            GROUP BY
                libro_isbn
            ORDER BY
                rating_count DESC
            LIMIT ${LIMIT};
        `;
        const [mostReviewedBooksOfTheWeek] = await connection.query(mostReviewedBooksOfTheWeekQuery);

        // get users that made the most reviews this week
        const mostActiveReviewersOfTheWeekQuery = `
            SELECT 
                reader.username,
                COUNT(review.rating) as review_count
            FROM
                reader
            INNER JOIN
                review
            ON
                reader.username = review.reviewer
            WHERE
                reviewed_at >= NOW() - INTERVAL 1 WEEK
            GROUP BY
                review.reviewer
            ORDER BY
                review_count DESC
            LIMIT ${LIMIT};
        `;
        const [mostActiveReviewersOfTheWeek] = await connection.query(mostActiveReviewersOfTheWeekQuery);

        // get listas with most followers
        const mostFollowedListasQuery = `
            SELECT 
                lista.id, 
                lista.name,
                lista.created_by,
                COUNT(lista_followings.reader_username) AS following_count
            FROM
                lista
            INNER JOIN
                lista_followings
            ON
                lista.id = lista_followings.lista_id
            GROUP BY
                lista_followings.lista_id
            ORDER BY 
                following_count DESC
            LIMIT ${LIMIT};
        `;
        const [mostFollowedListas] = await connection.query(mostFollowedListasQuery);

        connection.end();
        return NextResponse.json({
            topRatedBooksOfTheWeek,
            mostReviewedBooksOfTheWeek,
            mostActiveReviewersOfTheWeek,
            mostFollowedListas
        });
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}