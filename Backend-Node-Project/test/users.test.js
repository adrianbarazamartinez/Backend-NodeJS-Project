// Description: Testing the users API endpoints
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import server from "../server.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

describe('Users API',()=>{
    beforeAll(async ()=>{
        await User.deleteMany();
    });

    afterAll(async ()=>{
        server.close();
        await mongoose.connection.close();
    });
    test('create a new user', async ()=>{
        const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: "Test user",
            email: "test@email.com",
            password: "12345678",
            role: "user",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');

    });

    test('login a user', async ()=>{
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "test@email.com",
            password: "12345678",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

});