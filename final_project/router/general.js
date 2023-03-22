const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
   
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   
   
  let getBooks = new Promise((resolve,reject) => { 
      resolve(books);
  });

  getBooks.then((b) => { res.send(JSON.stringify(b,null,4)); });
   
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let getBookISBN = new Promise((resolve,reject) => { 
        
        resolve(books[isbn]);
    });
    getBookISBN.then((b) => {res.send(JSON.stringify(b,null,4)); });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let getBooksArray = new Promise((resolve,reject) => { 
        resolve(Object.values(books));         
    });

    getBooksArray.then((ba)=> {  return (ba.filter( (b)=>b.author===author ) ) })
    .then( (b) => {console.log(b); res.send(JSON.stringify(b,null,4)); } );
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let getBooksArray = new Promise((resolve,reject) => { 
        resolve(Object.values(books));
    });

    getBooksArray.then((ba)=> {  return (ba.filter( (b)=>b.title===title ) ) })
    .then( (b) => {console.log(b); res.send(JSON.stringify(b,null,4)); } );
   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   
  const isbn = parseInt(req.params.isbn);
   
  res.send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
