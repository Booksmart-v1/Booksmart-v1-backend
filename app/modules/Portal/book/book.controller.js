let fetch = import("node-fetch");
const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const books = mongoose.model("book");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");
require("dotenv").config();
const axios = require("axios");

class BookController extends Controller {
  async addBooks() {
    try {
      let newBooks = this.req.body;
      let {
        bookId,
        bookName,
        // bookPrice,
        // bookImageUrl,
        bookAuthor,
        bookDescription,
        ISBN,
        tags,
      } = this.req.body;
      if (
        bookId === undefined ||
        bookName === undefined ||
        // bookPrice === undefined ||
        bookDescription ||
        bookAuthor === undefined ||
        tags === undefined ||
        ISBN === undefined
      ) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      if (ISBN.length !== 13 && ISBN.length !== 10) {
        console.log(ISBN.length);
        return this.res.status(400).json({
          success: false,
          message: "Please enter valid ISBN",
        });
      }
      const candidate = new book({
        ...newBooks,
      });
      const savedBook = await candidate.save();
      return this.res.status(200).json({
        success: true,
        message: `Book added successfully`,
        data: {
          bookId: savedBook.bookId,
          bookName: savedBook.bookName,
          bookPrice: savedBook.bookPrice,
          bookImageUrl: savedBook.bookImageUrl,
          bookAuthor: savedBook.bookAuthor,
          bookDescription: savedBook.bookDescription,
          ISBN: savedBook.ISBN,
          tags: savedBook.tags,

          createdAt: savedBook.createdAt,
          updatedAt: savedBook.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
      return this.res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
  }

  async getBook() {
    try {
      let { ISBN, bookId } = this.req.body;
      if (ISBN === undefined && bookId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      if (ISBN === undefined) {
        const book = await books.findOne({ bookId });
        if (!book) {
          return this.res.status(400).json({
            success: false,
            message: "Book not found",
          });
        }
        return this.res.status(200).json({
          success: true,
          message: `Book found successfully`,
          data: {
            bookId: book.bookId,
            bookName: book.bookName,
            // bookPrice: book.bookPrice,
            bookImageUrl: book.bookImageUrl,
            bookAuthor: book.bookAuthor,
            bookDescription: book.bookDescription,
            ISBN: book.ISBN,
            tags: book.tags,
          },
        });
      }
      if (ISBN.length !== 13 && ISBN.length !== 10) {
        return this.res.status(400).json({
          success: false,
          message: "Please enter valid ISBN",
        });
      }
      const book = await books.findOne({ ISBN });
      if (!book) {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}&key=${process.env.BOOKAPI}`
        );
        const bookData = res.data.items[0];
        // const data = await bookData.volumeInfo.title;
        return this.res.status(200).json({
          success: true,
          message: `Book found successfully`,
          data: {
            bookId: null,
            bookName: bookData.volumeInfo.title,
            // bookImageUrl: book.bookImageUrl,
            bookAuthor: bookData.volumeInfo.authors[0],
            bookDescription: bookData.volumeInfo.description,
            ISBN: ISBN,
            tags: bookData.volumeInfo.categories,
            rating: bookData.volumeInfo.averageRating,
          },
        });
      }
      return this.res.status(200).json({
        success: true,
        message: `Book found successfully`,
        data: {
          bookId: book.bookId,
          bookName: book.bookName,
          //   bookImageUrl: book.bookImageUrl,
          bookAuthor: book.bookAuthor,
          bookDescription: book.bookDescription,
          ISBN: book.ISBN,
          tags: book.tags,
        },
      });
    } catch (error) {
      console.log(error);
      return this.res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
  }

  async getBooks() {}
}

module.exports = BookController;
