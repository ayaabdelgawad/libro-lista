import { useState } from 'react';
import Modal from 'react-modal';
import Rating from '@mui/material/Rating';
Modal.setAppElement('#root');

export default function ReviewCard({rid, isbn, reviewed_at, rating, reviewer, comments, reader, doRefresh}) {
    
    const [newRating, setNewRating] = useState(rating);
    
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    async function deleteReview() {
        fetch(`/api/reviews/${rid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {doRefresh()})
    }

    async function editReview(formData){
        const newComments = formData.get("comments");
        const payload = {rating: newRating, comments: newComments, libro_isbn: isbn, reviewer: reader};
        await fetch(`/api/reviews/${rid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(() => {doRefresh()});
        closeModal();
    }
    
    return (
    <div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
            <form 
                className="text-black flex flex-col" 
                onSubmit={(event) => {
                    event.preventDefault(); 
                    const formData = new FormData(event.target);
                    editReview(formData);
                }}
            >
                <label>Review</label>
                <Rating
                    name="rating"
                    value={newRating}
                    onChange={(event, newValue) => {setNewRating(newValue);}}
                />
                <textarea name="comments" defaultValue={comments}></textarea>
                <button type="submit">Submit</button>
            </form>
            <button className="text-black" onClick={closeModal}>Close</button>
        </Modal>
        <div className="reviewCard">
            <div className="flex flex-row" style={{justifyContent: 'space-between'}}>
                <p>By <b>{reviewer}</b> on {reviewed_at}</p>
                <Rating value={rating} readOnly></Rating>
            </div>
            <p>{comments}</p>
            {reader === reviewer ?
                <div>
                    <button type="button" className="text-xs" onClick={openModal}>Edit</button>
                    <button type="button" className="text-xs" onClick={deleteReview}>Delete</button>
                </div>
                :
                null
            }
        </div>
    </div>
    )
}