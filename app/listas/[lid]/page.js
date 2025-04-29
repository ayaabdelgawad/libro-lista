'use client'
import { useParams } from 'next/navigation'
import BookCard from '../../components/BookCard'
import { useEffect, useState } from 'react'
import Modal from 'react-modal';
Modal.setAppElement('#root');

 
export default function Page() {

  const params = useParams()
  const [refresh, setRefresh] = useState(false);
  const [curLibros, setCurLibros] = useState([]);
  const [allLibros, setAllLibros] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
      setIsOpen(true);
  }
  function closeModal() {
      setIsOpen(false);
  }
  
  async function addListaContent(formData) {
    const libro_isbn = formData.get("libro");
    const payload = {lista_id: params.lid, libro_isbn};
    await fetch('/api/lista-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    closeModal();
    setRefresh(!refresh);
  }
  
  // terrible efficiency; should be able to do single query from api
  useEffect(() => {
    fetch('/api/lista-content')
      .then((response) => response.json())
      .then((data) => {
        const filteredListaContent = data.filter((lista) => lista.lista_id == params.lid);
        const libroIsbns = filteredListaContent.map((lista) => lista.libro_isbn);

        fetch('/api/libros')
          .then((response) => response.json())
          .then((libros) => {
            setAllLibros(libros);
            const matchingLibros = libros.filter((libro) => libroIsbns.includes(libro.isbn));
            setCurLibros(matchingLibros);
          });
      });
  }, [refresh, params.lid]);


  return (

    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <form className="text-black" action={addListaContent}>
          <label>Book Title</label>
          <select name="libro">
          <option value="" disabled>Select an option</option>
          {allLibros.map((libro) => 
              <option key={libro.isbn} value={libro.isbn}>
                {libro.title}
              </option>
            )}
          </select>
          <button type="submit">Submit</button>
        </form>
        <button className="text-black" onClick={closeModal}>Close</button>
      </Modal>
      <button type="button" onClick={openModal}>Add Book</button>
      {curLibros.map((libro) => (
        <BookCard 
          key={libro.libro_isbn} 
          title={libro.title} 
          author={libro.author_name} 
        />))
      }
    </div>
  )
}