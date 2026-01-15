const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginLog = require("./model/LoginLog");

const app = express();
app.use(express.json());
app.use(cors());

// ================= MongoDB =================
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ================= User Schema =================
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);

// ================= Test =================
app.get("/", (req, res) => {
    res.send("Backend chal raha hai 🚀");
});

// ================= Register =================
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword
        });

        res.json({ success: true, message: "Register successful" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ================= Login =================
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            "mysecretkey",
            { expiresIn: "1h" }
        );

        // Save login data
        await LoginLog.create({ email });

        res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ================= Server Start =================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
