import BookCard from "./BookCard"
export default function LibroListaCard({name, created_by, books}){
    return <div className="libroLista">
        <p className="title">{name}</p>
        <p>By {created_by}</p>
        {books.map(book => <BookCard key={book.name} name={book.name} author={book.author}/>)}
    </div>

}