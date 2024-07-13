/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const db = require('../models/bookModel');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await db.findBook();
        if (books === null) {
          return res.json('could not find books');
        }
        return res.json(books);
      } catch (err) {
        return res.json('could not find books')
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;

      if (title === '' || !title) {
        return res.json('missing required field title');
      }
      //response will contain new book object including atleast _id and title
      
      const newBook = await db.createBook(title);

      return res.json(newBook);        
      
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      const deletedBooks = await db.deleteBooks();
      return res.json(deletedBooks);
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = await db.findBook(bookid);
      return res.json(book);
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment === '' || !comment) {
        return res.json('missing required field comment');
      }
      //json res format same as .get
      const updatedBook = await db.updateBook(bookid, comment);
      return res.json(updatedBook);
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const deletedBook = await db.deleteBooks(bookid);
      return res.json(deletedBook);
    });
  
};
