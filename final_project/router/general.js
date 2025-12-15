const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user already exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        // Add the new user
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(400).json({ message: "Username and password are required" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Return all books with nice formatting
    return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    // Iterate through books and find matches by author
    bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    // Iterate through books and find matches by title
    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ============================================================
// TASK 10-13: Async/Await versions using Promises with Axios
// ============================================================

// Task 10: Get all books using async-await
public_users.get('/async', async function (req, res) {
    try {
        // Simulate async operation using Promise
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(books);
                }, 100);
            });
        };

        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book by ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Using Promise
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 100);
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Task 12: Get books by Author using async-await
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookKeys = Object.keys(books);
                    const matchingBooks = [];

                    bookKeys.forEach(key => {
                        if (books[key].author.toLowerCase() === author.toLowerCase()) {
                            matchingBooks.push({ isbn: key, ...books[key] });
                        }
                    });

                    if (matchingBooks.length > 0) {
                        resolve(matchingBooks);
                    } else {
                        reject("No books found by this author");
                    }
                }, 100);
            });
        };

        const authorBooks = await getBooksByAuthor();
        return res.status(200).json(authorBooks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 13: Get books by Title using async-await
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const getBooksByTitle = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookKeys = Object.keys(books);
                    const matchingBooks = [];

                    bookKeys.forEach(key => {
                        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
                            matchingBooks.push({ isbn: key, ...books[key] });
                        }
                    });

                    if (matchingBooks.length > 0) {
                        resolve(matchingBooks);
                    } else {
                        reject("No books found with this title");
                    }
                }, 100);
            });
        };

        const titleBooks = await getBooksByTitle();
        return res.status(200).json(titleBooks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;
