import { useEffect, useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function LibroListaCard(isOpen, action){
    const [modalIsOpen, setIsOpen] = useState(false);
    function closeModal() {
        setIsOpen(false);
    }
    
    return <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
    >
        <form className="text-black" action={action}>
        <label>Name</label>
        <input
            className="w-full"
            type="text"
            name="name"
            placeholder="Name"
            required />
        <label>Description</label>
        <input 
            className="w-full"
            type="text"
            name="description"
            placeholder="Description" />
        <button type="submit">Submit</button>
        </form>
        <button className="text-black" onClick={closeModal}>Close</button>
    </Modal>
}