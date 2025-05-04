
-- -----------------------------------------------------
-- Schema libro_lista
-- -----------------------------------------------------
USE libro_lista;
-- -----------------------------------------------------
-- Populate `author` table
-- -----------------------------------------------------
INSERT INTO author (name, birthdate, main_genre) VALUES
('Ray Bradbury', '1920-08-22' NULL),
('F. Scott Fitzgerald', '1896-09-22', 'contemporary'),
('J. D. Salinger', '1919-01-01', NULL),
('Herman Melville', '1819-08-01', NULL),
('J. K. Rowling', '1965-07-31', 'fantasy'),
('J.R.R. Tolkien', '1892-01-03', 'fantasy'),
('Roberto Gonzalez Echevarria', '1943-11-28', NULL),
('Harper Lee', '1926-04-28', 'contemporary'),
('Yiyun Li', '1972-11-04', NULL),
('Jane Austen', '1775-12-16', 'contemporary'),
('Fyodor Dostoevsky', '1821-11-21', NULL),
('Homer', '0000-01-01', NULL),
('Lewis Carroll', '1832-01-27', 'fantasy'),
('John Steinbeck', '1902-02-27', NULL),
('Mark Twain', '1835-11-30', NULL),
('Budge Wilson', '1927-05-02', NULL),
('Mary Wollstonecraft Shelley', '1797-08-30', 'science fiction'),
('Antoine de Saint-Exupéry', '1900-06-29', NULL),
('Nicola Yoon', '1972-10-01', NULL),
('Khaled Hosseini', '1965-03-04', 'contemporary');


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
('The Hobbit', '9780544115552', 6, '2012-11-08'),
('Cervantes'' Don Quixote', '9780199960460', 7, '2010-04-10'),
('To Kill a Mockingbird', '9780810877238', 8, '1960-07-11'),
('Tolstoy Together: 85 Days of War and Peace with Yiyun Li', '9781734590760', 9, '2021-08-10'),
('Pride and Prejudice', '9780192815033', 10, '1980-01-01'),
('Crime and Punishment: A New Translation', '9781631490347', 11, '2017-11-21'),
('Odyssey', '9780198788805', 12, '0-01-01'),
('Alice in Wonderland', '9783988655851', 13, '2024-09-25'),
('The Grapes of Wrath', '9781417670352', 14, '2002-01-01'),
('The Adventures of Huckleberry Finn', '9781904633464', 15, '2010-08-01'),
('Before Green Gables', '9780399154683', 16, '2008-01-01'),
('Frankenstein, Or, The Modern Prometheus', '9780192815323', 17, '1980-01-01'),
('The Little Prince', '9780156012072', 18, '2000-01-01'),
('The Sun Is Also a Star', '9780385683692', 19, '2016-11-01'),
('A Thousand Splendid Suns', '9781101010907', 20, '2008-11-25');

-- -----------------------------------------------------
-- Populate `reader` table with dummy user
-- -----------------------------------------------------
INSERT INTO reader (username, pw_hash, salt) VALUES
('reader1', 'hBENA8A.hfd8s4XujJuwrYmUUL26XLy', '9rTcHCI71Pw1PRYvMBMbbO'); -- pwd is 1234