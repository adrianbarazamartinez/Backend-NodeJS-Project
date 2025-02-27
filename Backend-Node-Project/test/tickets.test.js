// Description: test cases for tickets API
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import server from "../server.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

describe('Tickets API',()=>{
    let token;
    beforeAll(async ()=>{
        await User.deleteMany();
        const response = await request(app).post('/api/users/signup').send({
            name: "Test Ticket user",
            email: "testticket@email.com",
            password: "123455678",
            role: "user",
        });

        token = response.body.token;
    });

    beforeEach(async ()=>{
        await Ticket.deleteMany();
    });

    afterAll(async ()=>{
        server.close();
        await mongoose.connection.close();
    });

    test('create a new ticket', async ()=>{
        const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: "Test ticket",
            description: "Test description",
            priority: "high",
            status: "open",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('ticket');
        expect(response.body.ticket).toHaveProperty('title','Test ticket');
        expect(response.body.ticket).not.toHaveProperty('_id');
    });

    test('Get all tickets', async ()=>{
        const ticket1 = await Ticket.create({
            title: "Ticket 1",
            description: "Description 1",
            priority: "low",
            status: "open",
            user: "test-user-id"
        });
        await ticket1.save();

        const ticket2 = await Ticket.create({
            title: "Ticket 2",
            description: "Description 2",
            priority: "high",
            status: "closed",
            user: "test-user-id"
        });
        await ticket2.save();
        const response = await request(app).get('/api/tickets');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("results");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("currentPage");

        expect(response.body.total).toBe(2);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.results).toHaveLength(2);
        expect(response.body.results[0]).toHaveProperty('title','Ticket 1');
        expect(response.body.results[0]).not.toHaveProperty('_id');
    });

});
