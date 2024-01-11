import mongoose from "mongoose";

export default function connectToDB(url) {
    mongoose.connect(url).then((response) => console.log("connected to DB!"));
}