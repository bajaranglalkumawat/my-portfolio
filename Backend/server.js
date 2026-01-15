const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================= MongoDB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ================= SCHEMA + MODEL =================
const loginLogSchema = new mongoose.Schema({
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LoginLog = mongoose.model("LoginLog", loginLogSchema);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.send("Backend chal raha hai 🚀");
});

// ================= LOGIN API =================
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // MongoDB me save
        await LoginLog.create({
            email,
            password
        });

        if (email === "test@gmail.com" && password === "123") {
            res.json({ success: true, message: "Login success & saved" });
        } else {
            res.json({ success: false, message: "Invalid credentials but saved" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ================= USERS DATA API =================
app.get("/users", async (req, res) => {
    try {
        const users = await LoginLog.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ================= SERVER START =================
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
