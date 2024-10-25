// Purpose: This file defines the Ticket model, which represents a ticket in the database.
// Importing mongoose and uuid
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
// Defining the ticket schema
const ticketSchema = new mongoose.Schema(
    { // The schema defines the structure of the document that will be stored in the database.
        id: {type:String, default:uuidv4, required:true, unique:true},
        user: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
        status: {type: String, enum:["open", "in-progress", "closed"], default: "open"},
        priority: {type: String, enum:["low", "medium", "high"], default: "low"},
        title: {type: String, required: true},
        description: {type: String, required: true},
    },
    {
        toJSON: {// This is a mongoose option that allows us to modify the JSON representation of the document before it is returned to the client.
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
            },
            virtuals: true, // This option tells mongoose to include virtual properties in the JSON representation of the document.
        },
    }
);
// Indexing the id and user fields
ticketSchema.index({id: 1, user: 1});
// Creating the Ticket model
const Ticket = mongoose.model("Ticket", ticketSchema);
// Exporting the Ticket model
export default Ticket;