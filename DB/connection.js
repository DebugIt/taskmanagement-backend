const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(console.log("DB connected")).catch(err => console.log("Error connection to DB", err))