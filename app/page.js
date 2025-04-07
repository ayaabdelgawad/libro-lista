'use client';

import { useEffect, useState } from 'react';
import LibroListaCard from "./components/LibroListaCard";
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function Home() {
  const reader = 'reader1';
  const [myListas, setMyListas] = useState([]);
  const [otherListas, setOtherListas] = useState([]);
  
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  async function addLista(formData) {
    const name = formData.get("name");
    const description = formData.get("description");
    const created_by = reader;
    const payload = {name, description, created_by};
    const response = await fetch('/api/listas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    closeModal();
    // TODO: reload page so new lista shows up
  }

  useEffect(() => {
    fetch('/api/listas')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMyListas(data.filter((lista) => lista.created_by === reader));
        setOtherListas(data.filter((lista) => lista.created_by !== reader));
      });
  }, []);

  return (
    <div>
      <h1 className="text-4xl">Welcome, <b>{reader}</b>!</h1>
      <div>
        <div className="flex row" style={{justifyContent: "space-between"}}>
          <h2 className="text-2xl">My Listas</h2>
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={openModal}
          >+</button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        >
          <form className="text-black" action={addLista}>
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
        {myListas.map(lista => <LibroListaCard key={lista.id} lid={lista.id} name={lista.name} description={lista.description} created_by={lista.created_by} />)}
      </div>
      <div>
        <h2 className="text-2xl">All Listas</h2>
        {otherListas.map(lista => <LibroListaCard key={lista.id} lid={lista.id} name={lista.name} description={lista.description} created_by={lista.created_by} />)}
      </div>
    </div>    
  )
}
