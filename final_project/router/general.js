const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doExists = (username) =>{
    let userWithName = users.filter((user) => user.username === username);
    if(userWithName.length>0){
        return true;
    }else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if(username && password){
        if(!doExists(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message:"user successfully registred. now you can login"});

        }else{
            return res.status(404).json({message:"user already exists"});
        }
    }else{
        return res.status(404).json({message:"unable to register user"});
    }

//   res.send(JSON.stringify(users,null,4));
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(JSON.stringify(books[isbn],null,4));
  }else{
    return res.status(404).json({message:"Book Not found"});
  }
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  

// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author; // Extract author name from request parameters

    const isbnKeys = Object.keys(books);
    const matchingBooks = [];

    isbnKeys.forEach(isbn => {
        const book = books[isbn];
        if (book.author === author) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        res.status(404).json({ message: "Books not found for specified author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const  title = req.params.title;
  const isbnKeys = Object.keys(books);
  const matchingBooks = [];
  isbnKeys.forEach(isbn => {
    const book  = books[isbn];
    if(book.title === title){
        matchingBooks.push(book);
    }
  })
  if(matchingBooks.length>0){
    return res.send(JSON.stringify(matchingBooks,null,4));
  }else{
    return res.status(404).json({message:"Book not found"});
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    isbn = req.params.isbn;
    if(books[isbn]){
      return res.send(JSON.stringify(books[isbn].reviews,null,4));
    }else{
      return res.status(404).json({message:"Book Not found"});
    }
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
