require('dotenv').config()
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error(err));

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String]},
    commentCount: { type: Number, default: 0}
})

const books = mongoose.model('books', bookSchema);

const db = {
    async findBook(_id = '') {
        try {
            let book;
            if (_id !== '') {
                book = await books.findById(_id);
                if (book === null) {
                    return 'no book exists';
                }
                return { title: book.title, _id: book._id, comments: book.comments }
            }

            book = await books.find();
            if (book === null) {
                return null;
            };

            return book.map(b => ({ title: b.title, _id: b._id, commentcount: b.commentCount }));

        } catch (err) {
            console.error(err);
            return 'no book exists';
        }        
    },

    async updateBook(_id, comment) {
        try {
            const book = await books.findById(_id);
            if (book === null) {
                return 'no book exists'
            }
            const updatedBook = await books.findByIdAndUpdate(
                _id,
                {
                    $push: { comments: comment },
                    $inc: { commentCount: 1 }
                },
                { new: true, useFindAndModify: false }
            );
            return { 
                comment: updatedBook.comments, 
                _id: updatedBook._id,  
                title: updatedBook.title,
                commentCount: updatedBook.commentCount,
                __v: updatedBook.__v
            }
         
        } catch (err) {
            console.error(err);
            return 'update unsuccessful';
        }
    },

    async createBook(title) {
        try {
            const newBook = new books({
                title: title
            });
        
            const savedBook = await newBook.save();

            if (savedBook === null) {
                return 'could not save book';
            }

            return {_id: savedBook._id, title: savedBook.title };
        } catch (err) {
            console.error(err);
            return 'could not save book';
        }
    },

    async deleteBooks(_id = null) {
        if (_id) {
            try {
                const book = await books.findById(_id);
                if (book === null) {
                    return 'no book exists'
                }

                const deletedBook = await books.findByIdAndDelete(_id);
                if (deletedBook === null) {
                    return 'delete unsuccessfull'
                }
                return 'delete successful'

            } catch (err) {
                console.error(err);
                return 'delete unsuccessful';
            }            
        } 

        try {
            const deleteAllBooks = await books.deleteMany({});
            if (deleteAllBooks === null) {
                return 'complete delete unsuccessfull'
            }
            return 'complete delete successful'
        } catch (err) {
            console.error(err);
            return 'complete delete unsuccessful'
        }
        
    }

}

module.exports = db;


