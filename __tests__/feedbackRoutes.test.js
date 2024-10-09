// Datei: feedback-app/__tests__/feedbackRoutes.test.js

import request from 'supertest';
import express from 'express';
import feedbackRouter from '../src/routes/feedbackRoutes'; 
import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController';

jest.mock('../src/controllers/feedbackController', () => ({
    addFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    deleteFeedbackByTitle: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/', feedbackRouter);

describe('Feedback Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /feedback - sollte Feedback speichern und 201 zurückgeben', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        addFeedback.mockResolvedValue(mockFeedback);

        const response = await request(app)
            .post('/feedback')
            .send({ title: 'Test Feedback', text: 'Test text' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Feedback erfolgreich gespeichert.");
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('GET /feedback - sollte alle Feedbacks zurückgeben', async () => {
        const mockFeedbacks = [
            { id: 1, title: 'Test Feedback 1', text: 'Test text 1' },
            { id: 2, title: 'Test Feedback 2', text: 'Test text 2' }
        ];

        getAllFeedback.mockResolvedValue(mockFeedbacks);

        const response = await request(app).get('/feedback');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockFeedbacks);
    });

    it('DELETE /feedback/:title - sollte Feedback löschen und 200 zurückgeben', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        deleteFeedbackByTitle.mockResolvedValue(mockFeedback);

        const response = await request(app).delete('/feedback/Test Feedback');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Feedback erfolgreich gelöscht."); // Überprüfe den korrekten Text
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('DELETE /feedback/:title - sollte 404 zurückgeben, wenn das Feedback nicht gefunden wird', async () => {
        deleteFeedbackByTitle.mockResolvedValue(null);

        const response = await request(app).delete('/feedback/NonexistentFeedback');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Feedback nicht gefunden."); // Überprüfe die Fehlermeldung
    });
});
