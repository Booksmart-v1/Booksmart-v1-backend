// const util = require('util');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const dbConfig = require('../../configs/configs');

// var storage = new GridFsStorage({
//   url: 'mongodb://user1:myyKK1HlvKedXxjN@booksmart-shard-00-00.zjufe.mongodb.net:27017,booksmart-shard-00-01.zjufe.mongodb.net:27017,booksmart-shard-00-02.zjufe.mongodb.net:27017/booksmart?replicaSet=atlas-g9eyff-shard-0&ssl=true&authSource=admin',
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ['image/png', 'image/jpeg'];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-booksmart-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: dbConfig.imgBucket,
//       filename: `${Date.now()}-booksmart-${file.originalname}`,
//     };
//   },
// });

// var uploadFiles = multer({ storage: storage }).single('file');
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;
