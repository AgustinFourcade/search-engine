const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE_URL;
console.log("URI: ", MONGODB_URI);

module.exports = {
  getClient: async () => {
    try {
      if (mongoose.connection.readyState < 1) {
        mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected successfully to database ✈");
      }
    } catch (e) {
      console.log("ERROR CONNECTING TO MONGO >>>", e);
    }
    return mongoose;
  },
};
