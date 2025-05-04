'use client'
import { useParams } from 'next/navigation'
import BookCard from '../../components/BookCard'
import { useEffect, useState } from 'react'
import NavBar from "../../components/NavBar";
import Modal from 'react-modal';
Modal.setAppElement('#root');

 
export default function Page() {

  const params = useParams()
  const [reader, setReader] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [curLibros, setCurLibros] = useState([]);
  const [allLibros, setAllLibros] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [checked, setChecked] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
      setIsOpen(true);
  }
  function closeModal() {
      setIsOpen(false);
  }

  useEffect(() => {
    const cookies = document.cookie;
    const match = cookies.match(/username=([^;]+)/);
    const username = match ? match[1] : null;

    if (!username) {
    router.push('/login');
    } else {
    setReader(username);
    }
}, []);

  function handleChecked(event) {
    setChecked(event.target.checked);
  }
  
  async function addListaContent(formData) {
    const libro_isbn = checked ? formData.get("libro") : formData.get("isbn");
    if (!checked) {
      // upload new book first
      const isbn = formData.get("isbn");
      const title = formData.get("title");
      const publication_date = formData.get("publication_date");
      const author_name = formData.get("author");
      const payload = {isbn, title, publication_date, author_name}
      await fetch(`/api/libros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    }
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
    fetch('/api/listas')
      .then((response) => response.json())
      .then((data) => {
        const thisLista = data.find((lista) => lista.id == params.lid);
        setName(thisLista.name);
        setDescription(thisLista.description);
      });
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
    fetch('/api/authors')
      .then((response) => response.json())
      .then((data) =>{
        setAllAuthors(data)
      });
  }, [refresh, params.lid]);


  return (

    <div>
      <NavBar/>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <form className="text-black flex flex-col" action={addListaContent}>
          <label>Browse Libro Collection</label>
          <label className="switch">
            <input type="checkbox" checked={checked} onChange={handleChecked}/>
            <span className="slider round"></span>
          </label>
          {checked ? 
            <div className="flex flex-col">
              <label>Select a Libro By Title</label>
              <select name="libro">
              {allLibros.map((libro) => 
                  <option key={libro.isbn} value={libro.isbn}>
                    {libro.title}
                  </option>
                )}
              </select>
            </div>
            :
            <div className="flex flex-col">
              <label>ISBN</label>
              <input name="isbn"></input>
              <label>Title</label>
              <input name="title"></input>
              <label>Published In</label>
              <input name="publication_date" type="date"></input>
              <label>Author</label>
              <input name="author" list="authors"></input>
              <datalist id="authors">
                {allAuthors.map((author) => (<option key={author.id} value={author.name}></option>))}
              </datalist>
            </div>
          }
          <button type="submit">Submit</button>
          <button className="text-black" onClick={closeModal}>Close</button>
        </form>
      </Modal>
      <h1 className="text-4xl">{name}</h1>
      <h3 className="text-2xl">{description}</h3>
      <button type="button" onClick={openModal}>Add Libro</button>
      {curLibros.map((libro) => (
        <BookCard 
          key={libro.isbn}
          isbn={libro.isbn}
          lid={params.lid}
          title={libro.title} 
          author={libro.author_name}
          reader={reader}
          doRefresh={() => setRefresh(!refresh)}
        />))
      }
    </div>
  )
}