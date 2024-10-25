// Purpose: Populate the database with users and tickets
import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import "dotenv/config";

// Connect to the database
mongoose.connect(process.env.DB_URL)
    .then(() => console.log(`Connected to ${process.env.DB_URL}`))
    .catch(err => console.error('Failed to connect to MongoDB',err));

// Define the data to populate the database

const users = [
    {name: "user", role: "user", email: "user@email.com", password: "12345678"},
    {name: "admin", role: "admin", email: "admin@email.com", password: "12345678"}
];

const status = ["open", "closed", "in-progress"];
const priorities = ["low", "medium", "high"];

// Define the functions to populate the database
async function deleteCollections() { // Delete all documents in the collections
    await User.deleteMany();
    console.log("Users collection deleted");
    await Ticket.deleteMany();
    console.log("Tickets collection deleted");
}

async function createUsers() { // Create the users
    for (const userData of users) {
        const user = new User(userData);
        await user.save();
    }
}

async function createTickets () { // Create the tickets
    const users = await User.find({});
    for (let i = 0; i< 15; i++) {
        const ticket = new Ticket({
            title: `Ticket ${i+1}`,
            description: `Description for ticket ${i+1}`,
            status: status[Math.floor(Math.random() * status.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            user: users[Math.floor(Math.random() * users.length)].id
        });

        await ticket.save();
    }
}

async function populateDB() { // Populate the database
    await deleteCollections();
    await createUsers();
    await createTickets();
    console.log("Database populated");
    mongoose.disconnect();
}

// Call the populateDB function
populateDB();