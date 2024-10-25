// Purpose: Define the User model and schema.
// Importing required modules
import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt
import { v4 as uuidv4 } from "uuid";
// Defining the user schema
const userSchema = new mongoose.Schema(
    { // The schema defines the structure of the document that will be stored in the database.
        id:{type: String, default: uuidv4, required: true, unique: true},
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        password: {type: String, required: true, minlength: 8},
        role: {type: String, enum: ["user", "admin"], default: "user"},
    },
    {
        toJSON: { // This is a mongoose option that allows us to modify the JSON representation of the document before it is returned to the client.
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            },
            virtuals: true, // This option tells mongoose to include virtual properties in the JSON representation of the document.
        },
    }
);

userSchema.pre("save", async function (next) { // Hash the password before saving the user
    if (!this.isModified("password")) return next(); // If the password is not modified return next
    
    const salt = await bcrypt.genSalt(10); // Generate a salt of 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt

});

userSchema.index({ id: 1, email: 1}); // Indexing the id and email fields

const User = mongoose.model("User", userSchema); // Creating the User model

export default User;