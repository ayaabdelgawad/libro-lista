from flask import Flask, request, jsonify
import mysql.connector
import util

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  user="yourusername",
  password="yourpassword",
  database="libro_lista"
)

###############################################
# BOOK API ENDPOINTS
###############################################
BOOK_REQ_FIELDS = ['isbn', 'title', 'author_name']
BOOK_OPT_FIELDS = ['publication_date']

@app.get("/books")
def get_books():
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(
        """
        SELECT isbn, title, name AS author_name, publication_date FROM book
        INNER JOIN author
        WHERE book.author_id = author.id
        """
        )
    books = mycursor.fetchall()
    return jsonify(books)

@app.post("/book")
def add_book():
    try:
        book = util.get_json_and_check_fields(request, BOOK_REQ_FIELDS, BOOK_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        mycursor = mydb.cursor()
        # add author if not exist
        mycursor.execute("INSERT IGNORE INTO author (name) VALUES (%s)", (book['author_name'],))
        # then insert the book
        insert_sql = """
            INSERT INTO book 
            (isbn, title, author_id, publication_date)
            VALUES
            (%s, %s, (SELECT id FROM author WHERE name = %s), %s)
        """
        insert_val = (book['isbn'], book['title'], book['author_name'], book['publication_date'])
        mycursor.execute(insert_sql, insert_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

@app.put("/book/<string:oldisbn>")
def update_book(oldisbn):
    try:
        book = util.get_json_and_check_fields(request, BOOK_REQ_FIELDS, BOOK_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        mycursor = mydb.cursor()
        # add author if not exist
        mycursor.execute("INSERT IGNORE INTO author (name) VALUES (%s)", (book['author_name'],))
        # then update the book
        update_sql = """
            UPDATE book 
            SET isbn = %s, title = %s, author_id = (SELECT id FROM author WHERE name = %s), publication_date = %s 
            WHERE isbn = %s
        """
        update_val = (
            book['isbn'], 
            book['title'], 
            book['author_name'], 
            book['publication_date'], 
            oldisbn
        )
        mycursor.execute(update_sql, update_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

@app.delete("/book/<string:isbn>")
def delete_book(isbn):
    try:
        mycursor = mydb.cursor()
        delete_sql = "DELETE FROM book WHERE isbn = %s"
        delete_val = (isbn,)
        mycursor.execute(delete_sql, delete_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

###############################################
# AUTHOR API ENDPOINTS
###############################################
AUTHOR_REQ_FIELDS = ['name']
AUTHOR_OPT_FIELDS = ['main_genre']

@app.get("/authors")
def get_authors():
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id, name, main_genre FROM author")
    authors = mycursor.fetchall()
    return jsonify(authors)

@app.post("/author")
def add_author():
    try:
        author = util.get_json_and_check_fields(
            request, 
            AUTHOR_REQ_FIELDS, 
            AUTHOR_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        mycursor = mydb.cursor()
        insert_sql = "INSERT INTO author (name, main_genre) VALUES (%s, %s)"
        insert_val = (author['name'], author['main_genre'])
        mycursor.execute(insert_sql, insert_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422
    
# TODO: delete and edit endpoints for author api
@app.put("/author/<int:id>")
def update_author(id):
    pass
@app.delete("/author/<int:id>")
def delete_author(id):
    pass

###############################################
# READER API ENDPOINTS
###############################################
READER_REQ_FIELDS = ['username', 'pw_hash', 'salt']
READER_OPT_FIELDS = []

@app.get("/readers")
def get_readers():
    mycursor = mydb.cursor(dictionary=True)
    # TODO: create a view so that only have access to username, not pw hash
    mycursor.execute("SELECT username FROM readers")
    readers = mycursor.fetchall()
    return jsonify(readers)

@app.post("/reader")
def add_reader():
    try:
        reader = util.get_json_and_check_fields(request, READER_REQ_FIELDS, READER_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        insert_sql = """
            INSERT INTO reader 
            (username, pw_hash, salt)
            VALUES
            (%s, %s, %s)
        """
        insert_val = (reader['username'], reader['pw_hash'], reader['salt'])
        mycursor.execute(insert_sql, insert_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

# TODO: this endpoint should be guarded (only admin or self should update)
@app.put("/reader/<string:oldusername>")
def update_reader(oldusername):
    try:
        reader = util.get_json_and_check_fields(request, READER_REQ_FIELDS, READER_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        # TODO: should check that new username is not already taken
        update_sql = """
            UPDATE reader 
            SET username = %s, pw_hash = %s, salt = %s
            WHERE username = %s
        """
        update_val = (
            reader['username'],
            reader['pw_hash'],
            reader['salt']
            oldusername
        )
        mycursor.execute(update_sql, update_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

@app.delete("/reader/<string:username>")
def delete_reader(username):
    try:
        mycursor = mydb.cursor()
        delete_sql = "DELETE FROM reader WHERE username = %s"
        delete_val = (username,)
        mycursor.execute(delete_sql, delete_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

###############################################
# LISTA API ENDPOINTS
###############################################
LISTA_REQ_FIELDS = ['name', 'created_by']
LISTA_OPT_FIELDS = ['description']

@app.get("/listas")
def get_listas():
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id, name, description, created_by FROM lista")
    listas = mycursor.fetchall()
    return jsonify(listas)

@app.post("/lista")
def add_lista():
    try:
        lista = util.get_json_and_check_fields(request, LISTA_REQ_FIELDS, LISTA_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        insert_sql = """
            INSERT INTO lista 
            (name, description, created_by)
            VALUES
            (%s, %s, %s)
        """
        insert_val = (lista['name'], lista['description'], lista['created_by'])
        mycursor.execute(insert_sql, insert_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

# TODO: ideally, this endpoint should be guarded so only creator can update
# maybe created_by field should not be changeable?
@app.put("/lista/<int:listaid>")
def update_lista(listaid):
    try:
        lista = util.get_json_and_check_fields(request, LISTA_REQ_FIELDS, LISTA_OPT_FIELDS)
    except Exception as e:
        return {'error' : str(e)}, 400
    try:
        update_sql = """
            UPDATE lista 
            SET name = %s, description = %s, created_by = %s 
            WHERE id = %s
        """
        update_val = (
            lista['name'],
            lista['description'],
            lista['created_by'], 
            listaid
        )
        mycursor.execute(update_sql, update_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422

@app.delete("/lista/<int:listaid>")
def delete_lista(listaid):
    try:
        mycursor = mydb.cursor()
        delete_sql = "DELETE FROM lista WHERE id = %s"
        delete_val = (listaid,)
        mycursor.execute(delete_sql, delete_val)
        mydb.commit()
        return {'message' : 'success'}, 200
    except Exception as e:
        return {'error' : 'could not handle request due to ' + str(e)}, 422
