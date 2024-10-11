const request = require('supertest');
const express = require('express');
const errorHandler = require('../src/middleware/errorHandler');  // Adjust path as needed

const app = express();

// Some route to simulate an error
app.get('/error', (req, res, next) => {
    const err = new Error('Test Error');
    next(err);  // Pass error to error handler
});

app.use(errorHandler);  // Use the error handler

describe('Error Handler Middleware', () => {
    it('should handle errors and return 500', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');  // Match the expected message
    });
});
