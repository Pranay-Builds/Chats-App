import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello, World!");
})


app.listen(PORT, () => {
    console.log(`✅ Chats Server is running on http://localhost:${PORT}`);
});
