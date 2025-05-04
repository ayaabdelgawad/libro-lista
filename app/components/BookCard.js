import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import Rating from '@mui/material/Rating';
Modal.setAppElement('#root');

export default function BookCard({reader, isbn, lid, title, author, doRefresh}){
    const router = useRouter();

    const [rating, setRating] = useState(1);
    
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    function deleteFromLista() {
        fetch(`/api/lista-content/${lid}/${isbn}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {doRefresh()})
    }

    async function addReview(formData){
        const comments = formData.get("comments");
        const payload = {rating, comments, libro_isbn: isbn, reviewer: reader};
        await fetch('/api/reviews', {
            method: 'POST',
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
                addReview(formData);
            }}
        >
            <label>Review</label>
            <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {setRating(newValue);}}
            />
            <textarea name="comments"></textarea>
            <button type="submit">Submit</button>
        </form>
        <button className="text-black" onClick={closeModal}>Close</button>
        </Modal>
        <div className="bookCard">
            <p className="subtitle">{title}</p>
            <p>By {author}</p>
            <div className="flex flex-row">
                <button type="button" onClick={openModal}>Add Review</button>
                <button type="button" onClick={() => {router.push(`/reviews/${isbn}`)}}>Read Reviews</button>
                <button type="button" className="accent" onClick={deleteFromLista}>Delete</button>
            </div>
        </div>
    </div>
    )
}