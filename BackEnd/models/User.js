import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: String,
    lastname: String,
    passwordHash: String,
    persons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Person",
        }
    ]
});

userSchema.plugin(mongooseUniqueValidator);

userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const User = mongoose.model("User", userSchema);

export default User;