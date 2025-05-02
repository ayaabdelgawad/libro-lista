'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LibroListaCard from "./components/LibroListaCard";
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function Home() {

  const router = useRouter();
  
  const [reader, setReader] = useState('');
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const [myListas, setMyListas] = useState([]);
  const [otherListas, setOtherListas] = useState([]);
  
  useEffect(() => {
    const cookies = document.cookie;
    const match = cookies.match(/username=([^;]+)/);
    const username = match ? match[1] : null;
    
    if (!username){
      router.push('/login');
    } else {
      setReader(username);
    }
  }, []);

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const [refresh, setRefresh] = useState(false);


  async function addLista(formData) {
    const name = formData.get("name");
    const description = formData.get("description");
    const created_by = reader;
    const payload = {name, description, created_by};
    await fetch('/api/listas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    closeModal();
    setRefresh(!refresh);
  }

  useEffect(() => {
    fetch('/api/listas')
      .then((response) => response.json())
      .then((data) => {
        setMyListas(data.filter((lista) => lista.created_by === reader));
        setOtherListas(data.filter((lista) => lista.created_by !== reader));
      });
    
    fetch('/api/lista-followings')
      .then((response) => response.json())
      .then((data) => {
        setMyFollowingIds(
          data
            .filter((following) => following.reader_username === reader)
            .map((following) => following.lista_id));
      })
  }, [refresh, reader]);

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
        {myListas.map(lista => 
          <div 
            key={lista.id} 
            onClick={() => router.push(`/listas/${lista.id}`)}
          >
            <LibroListaCard 
              lid={lista.id} 
              name={lista.name} 
              description={lista.description} 
              created_by={lista.created_by}
              following={true}
              doRefresh={() => setRefresh(!refresh)} 
            />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl">All Listas</h2>
        {otherListas.map(lista => 
          <div 
            key={lista.id} 
            onClick={() => router.push(`/listas/${lista.id}`)}
          >
            <LibroListaCard 
              lid={lista.id} 
              name={lista.name} 
              description={lista.description} 
              created_by={lista.created_by}
              following={myFollowingIds.includes(lista.id)}
              doRefresh={() => setRefresh(!refresh)}
            />
          </div>
        )}
      </div>
    </div>    
  )
}
