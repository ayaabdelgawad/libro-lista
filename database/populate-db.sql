
-- -----------------------------------------------------
-- Schema libro_lista
-- -----------------------------------------------------
USE libro_lista;
-- -----------------------------------------------------
-- Populate `author` table
-- -----------------------------------------------------
INSERT INTO author (name, main_genre) VALUES
('Ray Bradbury', NULL),
('F. Scott Fitzgerald', 'contemporary'),
('J. D. Salinger', NULL),
('Herman Melville', NULL),
('J. K. Rowling', 'fantasy'),
('John Ronald Reuel Tolkien', 'fantasy'),
('J.R.R. Tolkien', 'fantasy'),
('Roberto Gonzalez Echevarria', NULL),
('Michael J. Meyer', NULL),
('Yiyun Li', NULL),
('Jane Austen', NULL),
('Fyodor Dostoevsky', NULL),
('Homer', NULL),
('Lewis Carroll', 'fantasy'),
('John Steinbeck', NULL),
('Mark Twain', NULL),
('Budge Wilson', NULL),
('Mary Wollstonecraft Shelley', 'science fiction'),
('Antoine de Saint-Exupéry', NULL),
('Nicola Yoon', NULL),
('Khaled Hosseini', 'contemporary');


-- -----------------------------------------------------
-- Populate `libro` table
-- -----------------------------------------------------
INSERT INTO libro (title, isbn, author_id, publication_date) VALUES
('Fahrenheit 451', '9780345410016', 1, '1996-01-01'),
('The Great Gatsby', '9780743246392', 2, '2003-05-27'),
('The Catcher in the Rye', '9780316460002', 3, '2019-08-13'),
('Moby-Dick', '9780142437247', 4, '2002-12-31'),
('Harry Potter and the Cursed Child - Parts One and Two', '9781338099133', 5, '2016-07-31'),
('The Lord of the Rings', '9780048232298', 6, '1983-01-01'),
('The Hobbit', '9780544115552', 7, '2012-11-08'),
('Cervantes'' Don Quixote', '9780199960460', 8, '2010-04-10'),
('Harper Lee''s To Kill a Mockingbird', '9780810877238', 9, '2010-10-14'),
('Tolstoy Together: 85 Days of War and Peace with Yiyun Li', '9781734590760', 10, '2021-08-10'),
('Pride and Prejudice', '9780192815033', 11, '1980-01-01'),
('Crime and Punishment: A New Translation', '9781631490347', 12, '2017-11-21'),
('Odyssey', '9780198788805', 13, '2019-01-01'),
('Alice in Wonderland', '9783988655851', 14, '2024-09-25'),
('The Grapes of Wrath', '9781417670352', 15, '2002-01-01'),
('The Adventures of Huckleberry Finn', '9781904633464', 16, '2010-08-01'),
('Before Green Gables', '9780399154683', 17, '2008-01-01'),
('Frankenstein, Or, The Modern Prometheus', '9780192815323', 18, '1980-01-01'),
('The Little Prince', '9780156012072', 19, '2000-01-01'),
('The Sun Is Also a Star', '9780385683692', 20, '2016-11-01'),
('A Thousand Splendid Suns', '9781101010907', 21, '2008-11-25');

-- -----------------------------------------------------
-- Populate `reader` table with dummy user
-- -----------------------------------------------------
INSERT INTO reader (username, pw_hash, salt) VALUES
('reader1', 'hBENA8A.hfd8s4XujJuwrYmUUL26XLy', '9rTcHCI71Pw1PRYvMBMbbO'); -- pwd is 1234