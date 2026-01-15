const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
    email: String,
    password: String,  // optional, agar password bhi store karna hai
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("LoginLog", loginLogSchema);
