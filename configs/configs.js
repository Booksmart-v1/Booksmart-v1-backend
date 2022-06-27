require("dotenv").config();

module.exports = {
  mongodb: {
    //Database Configuration
    port: process.env.DB_PORT || 27017,
    dbName: process.env.DB_NAME,
    url:
      process.env.COMPASS_URL ||
      "mongodb://localhost:27017/" + process.env.DB_NAME,
    host: process.env.DEV_HOST,
    user: process.env.DB_USER,
    mongoOptions: {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    },
  },
  serverPort: process.env.PORT,
  portal: {
    baseApiUrl: "/v2",
    token: {
      privateKey: "LŌcĀtĒ",
      expiry: "30d",
    },
  },
  fast2smsAPI: {
    authorization: process.env.FAST2SMS,
  },
};
