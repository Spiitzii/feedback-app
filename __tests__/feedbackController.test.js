// Datei: feedback-app/__tests__/feedbackController.test.js

import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController'; 
import { pool } from '../src/db';

jest.mock('../src/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('Feedback Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Feedback sollte erfolgreich gespeichert werden', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        pool.query.mockResolvedValue({ rows: [mockFeedback] });

        const result = await addFeedback('Test Feedback', 'Test text');

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;', 
            ['Test Feedback', 'Test text']
        );
    });

    it('sollte alle Feedbacks abrufen', async () => {
        const mockFeedbacks = [
            { id: 1, title: 'Test Feedback 1', text: 'Test text 1' },
            { id: 2, title: 'Test Feedback 2', text: 'Test text 2' }
        ];

        pool.query.mockResolvedValue({ rows: mockFeedbacks });

        const result = await getAllFeedback();

        expect(result).toEqual(mockFeedbacks);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feedback;');
    });

    it('sollte Feedback anhand des Titels löschen', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        pool.query.mockResolvedValue({ rows: [mockFeedback], rowCount: 1 }); // mock für erfolgreiches Löschen

        const result = await deleteFeedbackByTitle('Test Feedback');

        expect(result.rowCount).toBe(1); // Überprüfe, dass ein Eintrag gelöscht wurde
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE title = $1 RETURNING *;', ['Test Feedback']);
    });

    it('sollte einen Fehler zurückgeben, wenn das Feedback nicht gefunden wird', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 }); // mock für kein gefundenes Feedback

        const result = await deleteFeedbackByTitle('Nonexistent Feedback');

        expect(result.rowCount).toBe(0); // Überprüfe, dass kein Eintrag gelöscht wurde
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE title = $1 RETURNING *;', ['Nonexistent Feedback']);
    });
});
