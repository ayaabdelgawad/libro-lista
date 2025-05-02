import BookCard from "./BookCard"
import { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function LibroListaCard({lid, name, description, created_by, books, following, doRefresh}){
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    
    function editLista(formData) {
        const newName = formData.get("name");
        const newDescription = formData.get("description");
        fetch(`/api/listas/${lid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName, description: newDescription, created_by})
        })
        .then(() => {closeModal()})
        .then(() => {doRefresh()})
    }
    
    function deleteLista() {
        fetch(`/api/listas/${lid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {doRefresh()})
    }

    return <div className="libroLista">
        <div className="flex flex-col">
            <p className="text-lg">{name}</p>
            {description? <p className="text-base">{description}</p> : null}
            <p className="text-sm">By {created_by}</p>
            {books ? books.map(book => <BookCard key={book.name} name={book.name} author={book.author}/>) : null}
        </div>
        <div className="flex flex-col">
            {following ? 
                <button className="text-xs accent">Unfollow</button>
                :
                <button type="button" className="text-xs" onClick={deleteLista}>Follow</button>
            }
            <button type="button" className="text-xs" onClick={openModal}>Edit</button>
            <button type="button" className="text-xs" onClick={deleteLista}>Delete</button>
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
            <form className="text-black" action={editLista}>
            <label>Name</label>
            <input
                className="w-full"
                type="text"
                name="name"
                defaultValue={name}
                required />
            <label>Description</label>
            <input 
                className="w-full"
                type="text"
                name="description"
                defaultValue={description} />
            <button type="submit">Submit</button>
            </form>
            <button className="text-black" onClick={closeModal}>Close</button>
        </Modal>
    </div>
}