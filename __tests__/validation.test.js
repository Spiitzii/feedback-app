// Datei: feedback-app/__tests__/validation.test.js

import express from 'express';
import request from 'supertest';
import { validationResult } from 'express-validator';
import { feedbackValidation } from '../src/middleware/validation'; 

const app = express();
app.use(express.json());

app.post('/feedback', feedbackValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(201).json({ message: "Validierung erfolgreich." });
});

describe('Validation Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('gibt Fehler zurück, wenn der Titel fehlt', async () => {
        const response = await request(app)
            .post('/feedback')
            .send({ text: "Test text" });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Titel ist erforderlich.');
    });

    it('gibt Fehler zurück, wenn der Text fehlt', async () => {
        const response = await request(app)
            .post('/feedback')
            .send({ title: "Test Title" });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Text ist erforderlich.');
    });

    it('gibt 201 zurück, wenn die Validierung erfolgreich ist', async () => {
        const response = await request(app)
            .post('/feedback')
            .send({ title: "Test Title", text: "Test text" });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Validierung erfolgreich.");
    });
});
