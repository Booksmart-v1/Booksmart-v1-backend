require("dotenv").config();

const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const bookAd = mongoose.model("bookAds");
const user = mongoose.model("user");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");
const aws = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");

const multer = require("multer");
const multers3 = require("multer-s3");
const axios = require("axios");

let s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = (bucketName) =>
  multer({
    storage: multers3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldName });
      },
      key: function (req, file, cb) {
        cb(null, `bookImage-${Date.now()}.jpeg`);
      },
    }),
  });

class BookAdsController extends Controller {
  async addBookAds() {
    try {
      let newBookAds = this.req.body;
      let {
        bookId,
        sellerId,
        sellerName,
        interestedBuyers,
        bookName,
        bookPrice,
        bookImageUrl,
        bookAuthor,
        bookDescription,
        bookCondition,
        tags,
        sellerAddress,
        sellerPincode,
        sold,
      } = this.req.body;
      if (
        bookId === undefined ||
        sellerId === undefined ||
        sellerName === undefined ||
        bookName === undefined ||
        bookPrice === undefined ||
        bookAuthor === undefined ||
        bookCondition === undefined ||
        tags === undefined ||
        sellerAddress === undefined ||
        sellerPincode === undefined ||
        sold === undefined
      ) {
        console.log(bookId);
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      if (sellerPincode.length !== 6) {
        return this.res.status(400).json({
          success: false,
          message: "Please enter valid pincode",
        });
      }
      console.log(bookId);
      let lat = 19.121;
      let lon = 72.899;
      axios
        .get(
          `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${sellerPincode}`,
          {
            headers: {
              "X-RapidAPI-Key":
                "97cc9d3ae5mshc34d4671b043d42p1451eajsnb18bf2761e25",
              "X-RapidAPI-Host":
                "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
            },
          }
        )
        .then((response) => {
          console.log(response.data);

          lat = response.data[0].lat;
          lon = response.data[0].lng;
        })
        .catch((error) => {
          console.error(error);
        });
      const candidate = new bookAd({
        ...newBookAds,
        lat: lat,
        lon: lon,
      });
      const savedBookAd = await candidate.save();
      return this.res.status(200).json({
        success: true,
        message: `Book Ads added successfully`,
        data: {
          bookAdId: savedBookAd._id,
          bookPrice: savedBookAd.bookPrice,
          bookName: savedBookAd.bookName,
          bookAuthor: savedBookAd.bookAuthor,
          bookCondition: savedBookAd.bookCondition,
          tags: savedBookAd.tags,
          sellerAddress: savedBookAd.sellerAddress,
          sold: savedBookAd.sold,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getBookAds() {
    try {
      let { limit, userId } = this.req.query;
      if (limit === undefined || userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      //   let bookAds = await bookAd.find({});
      let bookAdLimits = await bookAd.find({}).limit(limit);
      return this.res.status(200).json({
        success: true,
        message: "Book Ads fetched successfully",
        data: bookAdLimits,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async uploadImageS3() {
    try {
      console.log("entered api");
      const uploadSingle = upload("booksmart").single("img-upload");

      uploadSingle(this.req, this.res, (err) => {
        if (err)
          return this.res
            .status(400)
            .json({ success: false, message: err.message });

        // console.log(this.req);

        this.res.status(200).json({
          success: true,
          message: "Image Uploaded to s3 successfully.",
          data: this.req.file,
        });
      });
    } catch (e) {
      console.log(e);
      console.log("ERror in image upload");
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async markAsSold() {
    try {
      let { id, buyerId } = this.req.body;
      if (id === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      let updateDoc = {
        $set: {
          sold: true,
          buyerId: buyerId === undefined ? "unknown" : buyerId,
        },
      };

      const ba = await bookAd.find({ _id: id });
      console.log(id);
      console.log(ba);
      const result = await bookAd.updateOne({ _id: id }, updateDoc);
      const seller = await user.find({ _id: ba[0].sellerId });
      console.log(seller);
      console.log(ba[0]);
      console.log(result);
      let bs = seller[0].booksSold;

      bs.push(result._id);
      updateDoc = {
        $set: {
          booksSold: bs,
        },
      };
      const r1 = await user.updateOne({ _id: result.sellerId }, updateDoc);
      if (buyerId !== undefined) {
        const buyer = await user.findOne({ _id: buyerId });
        let bb = seller.booksBought;
        bb.push(result._id);
        updateDoc = {
          $set: {
            booksBought: bb,
          },
        };
        const r2 = await user.updateOne({ _id: buyerId }, updateDoc);
      }
      return this.res.status(200).json({
        success: true,
        message: `The book Ad has been marked as sold.`,
        data: result,
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async markAsUnsold() {
    try {
      let { id, buyerId } = this.req.body;
      if (id === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      let updateDoc = {
        $set: {
          sold: false,
          buyerId: undefined,
        },
      };
      const result = await bookAd.updateOne({ _id: id }, updateDoc);
      const seller = await user.findOne({ _id: result.sellerId });
      let bs = seller.booksSold;
      bs = bs.splice(bs.indexOf(result._id), 1);
      updateDoc = {
        $set: {
          booksSold: bs,
        },
      };
      const r1 = await user.updateOne({ _id: result.sellerId }, updateDoc);
      if (buyerId !== undefined) {
        const buyer = await user.findOne({ _id: buyerId });
        let bb = seller.booksBought;
        bb = bb.splice(bb.indexOf(result._id), 1);
        updateDoc = {
          $set: {
            booksBought: bb,
          },
        };
        const r2 = await user.updateOne({ _id: buyerId }, updateDoc);
      }
      return this.res.status(200).json({
        success: true,
        message: `The book Ad has been marked as unsold.`,
        data: result,
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async deleteAd() {
    try {
      let { id } = this.req.body;
      if (id === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      const result = await bookAd.deleteOne({ _id: id });
      return this.res.status(200).json({
        success: true,
        message: `The book Ad has been deleted.`,
        data: result,
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async getMyBookAds() {
    try {
      let { limit, userId } = this.req.query;
      if (limit === undefined || userId === undefined) {
        console.log(limit, userId);
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      let a = await bookAd.find({
        sellerId: userId,
      });
      // console.log(a);
      console.log(typeof a);
      if (a.length === 0) {
        a = [];
      }
      let b = await bookAd.find({}).where("interestedBuyers").all(userId);
      if (b.length === 0) {
        b = [];
      }
      // const union = [...new Set([...a, ...b])];

      return this.res.status(200).json({
        success: true,
        message: "My Book Ads fetched successfully",
        data: {
          selling: a,
          buying: b,
        },
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
module.exports = BookAdsController;
