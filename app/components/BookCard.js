import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import Rating from '@mui/material/Rating';
Modal.setAppElement('#root');

export default function BookCard({title, author}){
    const [modalIsOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(1);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    async function addReview(formData){
        const comments = formData.get("comments");
        payload = {rating, comments};
        await fetch('/api/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          closeModal();
    }

    
    return (
    <div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
        <form className="text-black" action={addReview}>
            <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {setRating(newValue);}}
            />
            <label>Review</label>
            <input name="comments"></input>
            <button type="submit">Submit</button>
        </form>
        <button className="text-black" onClick={closeModal}>Close</button>
        </Modal>
        <div className="bookCard">
            <p className="subtitle">{title}</p>
            <p>By {author}</p>
            <button type="button" onClick={openModal}>Review</button>
        </div>
    </div>
    )
}