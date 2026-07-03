import "dotenv/config"; // Instantly loads environment variables before any other file is imported!
import connectDB from "./config/db.js";
import app from "./app.js";

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
})