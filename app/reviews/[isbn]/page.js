'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from "../../components/NavBar";
import ReviewCard from '../../components/ReviewCard'

export default function Page() {
    const params = useParams();
    const [refresh, setRefresh] = useState(false);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    const [curReviews, setCurReviews] = useState([]);
    const [reader, setReader] = useState('');
    useEffect(() => {
        const cookies = document.cookie;
        const match = cookies.match(/username=([^;]+)/);
        const username = match ? match[1] : null;

        if (!username) {
            router.push('/login');
        } else {
            setReader(username);
        }

        fetch('/api/libros')
            .then((response) => response.json())
            .then((data) => {
                const curLibro = data.find((libro) => libro.isbn === params.isbn);
                setTitle(curLibro.title);
                setAuthor(curLibro.author_name);
            })
    }, []);

    useEffect(() => {
        fetch('/api/reviews')
            .then((response) => response.json())
            .then((data) => {
                setCurReviews(data.filter((review) => review.libro_isbn === params.isbn))
            })
    }, [refresh]);

    return (
    <div>
        <NavBar/>
        <h1 className="text-4xl">Reviews of {author}'s <i>{title}</i></h1>
        {curReviews.map((review) => 
            <ReviewCard
                key={review.id}
                rid={review.id}
                isbn={params.isbn}
                reviewed_at={review.reviewed_at}
                rating={review.rating}
                reviewer={review.reviewer}
                comments={review.comments}
                reader={reader}
                doRefresh={() => setRefresh(!refresh)}
            />
        )}
    </div>
    )
}