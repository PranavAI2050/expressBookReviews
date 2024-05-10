const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userWithName = users.filter((user) => user.username === username);
    if(userWithName.length>0){
        return true;
    }else{
        return false;
    }//returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{ 
    let userWithName = users.filter((user)=> user.username === username && user.password === password);
    if(userWithName.length>0){
        return true;
    }else{
        return false
    }
    //returns boolean
//write code to check if username and password match the one we have in records.
  
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    console.log(users)
  //Write your code here
  username = req.query.username;
  password = req.query.password;
  if(!username && !password){
    return res.status(404).json({message:"Error logging in"})
  }
if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data:username
    }, "access", {expiresIn : 60*60});
    req.session.authorization = {
        username, accessToken
    }
    console.log(req.session.authorization);
    return res.status(200).send("User successfully logged in ")
}else{
    return res.status(208).json({message:"Invalid Login. Check username and password"});
}
//   return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    if(!review){
        return res.status(400).json({message:"Review is empty"})        
    }
    if(books[isbn].reviews[username]){
        
        return res.status(200).json({ message: "Review updated successfully" });
    }else if(books[isbn]){
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review Posted successfully" });
    }else{
        return res.status(404).json({ message: "Book not found" });
    }
    // return res.status(300).json({message: "Yet to be implemented"});
  });
  
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if(books[isbn].reviews[username]){
        delete books[isbn].reviews[username];
        return res.send("Deleted review successfully");
    }else{
        return res.status(400).json({message:"no reviews to be deleted"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
