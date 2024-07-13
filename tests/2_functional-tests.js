/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const idRegex = /^([0-9a-zA-Z]{24})$/
const testBookId = '669281330932698820cf93cc';
const invalidTestId = '669148602e4290f18fd580d6';

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai  
            .request(server)
            .keepOpen()
            .post('/api/books')
            .send({
              title: 'Mowgli'
            })
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'could not save book');
                done(err)
              }
              assert.equal(res.status, 200);
              assert.equal(idRegex.test(res.body._id), true);
              assert.equal(res.body.title, 'Mowgli');
              done();
            });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/books')
            .send({
              title: ''
            })
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'could not save book');
              }
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field title');
              done();
            })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
            .request(server)
            .keepOpen()
            .get('/api/books')
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'no book exists');
                done(err);
              }
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'body should be an array');
              assert.isString(res.body[0].title, 'title should be a string');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], '_id', 'Books in array should have contain');
              assert.equal(idRegex.test(res.body[0]._id), true);
              assert.isNumber(res.body[0].commentcount, 'commentcount should be a number');
              done();
            });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
            .request(server)
            .keepOpen()
            .get(`/api/books/${invalidTestId}`)
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'no book exists');
                done(err);
              }

              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
            .request(server)
            .keepOpen()
            .get(`/api/books/${testBookId}`)
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'no book exists');
                done(err);
              }
              assert.equal(res.status, 200);
              assert.property(res.body, 'title', 'Books in array should containe title')
              assert.property(res.body, '_id', 'Books in array should contain _id');
              assert.property(res.body, 'comments', 'Bools in array should contain comments');
              assert.isArray(res.body.comments, 'comments should be an array');
              assert.equal(idRegex.test(res.body._id), true);
              done();
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai  
            .request(server)
            .keepOpen()
            .post(`/api/books/${testBookId}`)
            .send({
              comment: 'A very lovely book'
            })
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'update unsuccessful');
                done(err);
              }
              assert.equal(res.status, 200);
              assert.property(res.body, 'comments', 'Book should have contain comments');
              assert.property(res.body, '_id', 'Book should contain _id');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(res.body, 'commentcount', 'Book should contain commentCount');
              assert.property(res.body, '__v', 'Book should contain __v');
              assert.equal(idRegex.test(res.body._id), true);
              assert.isArray(res.body.comments, 'comment should be an array')
              assert.isNumber(res.body.commentcount, 'commentcount should be a number');
              assert.isAbove(res.body.commentcount, 0, 'commentcount should be greate than 0');
              done();
            })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${testBookId}`)
            .send({
              comment: ''
            })
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'update unsuccessful');
                done(err);
               
              }
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field comment');
              done();
            })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${invalidTestId}`)
            .send({
              comment: 'This is throw an error'
            })
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'update unsuccessful');
                done(err);
              }
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
            .request(server)
            .keepOpen()
            .delete(`/api/books/${testBookId}`)
            .end(function(err, res) {
              if (err) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'delete unsuccessful');
                done(err);
              }
              assert.equal(res.status, 200);
              assert.equal(res.body, 'delete successful');
              done();
            })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete(`/api/books/${invalidTestId}`)
        .end(function(err, res) {
          if (err) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete unsuccessful');
            done(err);
          }
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        })
      });

    });

  });

});
