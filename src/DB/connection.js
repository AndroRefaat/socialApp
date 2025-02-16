import mongoose from "mongoose";
const connectDB = async () => {
    // console.log("CONNECTION_URI:", process.env.CONNECTION_URL);

    await mongoose.connect(process.env.CONNECTION_URL)
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log(err.message))
}

export default connectDB;