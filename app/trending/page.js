'use client';

import { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import Rating from '@mui/material/Rating';

export default function Page() {

    const [topRatedBooksOfTheWeek, setTopRatedBooksOfTheWeek] = useState([]);
    const [mostReviewedBooksOfTheWeek, setMostReviewedBooksOfTheWeek] = useState([]);
    const [mostActiveReviewersOfTheWeek, setMostActiveReviewersOfTheWeek] = useState([]);
    const [mostFollowedListas, setMostFollowedListas] = useState([]);
    
    useEffect(() => {
        fetch('/api/trending')
            .then((response) => response.json())
            .then((data) => {
                setTopRatedBooksOfTheWeek(data.topRatedBooksOfTheWeek);
                setMostReviewedBooksOfTheWeek(data.mostReviewedBooksOfTheWeek);
                setMostActiveReviewersOfTheWeek(data.mostActiveReviewersOfTheWeek);
                setMostFollowedListas(data.mostFollowedListas);
            })
    }, []);

    return (<div>
        <NavBar/>
        <h3 className="text-2xl">This Week's Top Rated Books</h3>
        {topRatedBooksOfTheWeek.map((book) => 
            <div key={book.isbn}>
                <p>{book.author_name}'s <i>{book.title}</i></p>
                <Rating defaultValue={book.average_rating} precision={0.01} readOnly />
            </div>)}
        <h3 className="text-2xl">This Week's Most Reviewed Books</h3>
        {mostReviewedBooksOfTheWeek.map((book) => 
            <div key={book.isbn}>
                <b>{book.author_name}'s <i>{book.title}</i></b>
                <p>{book.rating_count} reviews</p>
            </div>)}
        <h3 className="text-2xl">This Week's Most Active Reviewers</h3>
        {mostActiveReviewersOfTheWeek.map((reviewer) => 
            <div key={reviewer.username}>
                <p><b>{reviewer.username}</b> - {reviewer.review_count} reviews</p>
            </div>)}
        <h3 className="text-2xl">Most Popular Listas of All Time</h3>
        {mostFollowedListas.map((lista) => 
            <div key={lista.id}>
                <p><b>{lista.created_by}'s {lista.name}</b> - {lista.following_count} followers</p>
            </div>)}
    </div>)
}