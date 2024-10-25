// Description: This file contains the routes for the tickets.
import express from "express";
import Ticket from "../models/Ticket.js";
import ticketSchema from "../validations/ticketValidation.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import buildFilter from "../middlewares/filter.js";
import paginate from "../middlewares/paginate.js";

const router = express.Router();

//get all tickets
//GET /api/tickets/
//GET /api/tickets/?status=open
//GET /api/tickets/?priority=low
//GET /api/tickets/?search=issue
//GET /api/tickets/?status=open&priority=low
//GET /api/tickets/?page=1&pageSize=10
//Public
router.get("/",buildFilter,paginate(Ticket), async (req, res) => {
    res.status(200).json(req.paginatedResults);
});

//create a ticket
//POST /api/tickets/
//Private (only for logged in users)
//Ticket Schema: user, title, description, priority, status
router.post("/", auth, async (req, res) => {
    const { error } = ticketSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const ticket = new Ticket({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json({ ticket: newTicket });
    } catch(error){
        res.status(500).json({ message: "Server Error" + error.message });
    }
});

//Get a ticket by id
//GET /api/tickets/:id
//Public
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });
        if(!ticket){
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ ticket: ticket });
    } catch(error) {
        res.status(500).json({ message: "Server Error" + error.message });
    }
});

//Update a ticket by id
//PUT /api/tickets/:id
//Private (only for logged in users)
//Ticket Schema: user, title, description, priority, status
router.put("/:id", auth, async (req, res) => {
    const updates = req.body;

    try{
        const ticket = await Ticket.findOneAndUpdate({ id:req.params.id }, updates, {new:true});
        if(!ticket){
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ ticket: ticket });
    } catch(error){
        res.status(500).json({ message: "Server Error" + error.message });
    }
});

//Delete a ticket by id
//DELETE /api/tickets/:id
//Private (only ADMIN users can delete tickets)
router.delete("/:id", [auth, admin], async (req, res) => {
    try{
        const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
        if(!ticket){
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ ticket: ticket });
    } catch (error){
        res.status(500).json({ message: "Server Error" + error.message });
    }
});

export default router;