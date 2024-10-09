// Datei: feedback-app/__tests__/errorHandler.test.js

import { errorHandler } from '../src/middleware/errorHandler'; 
import httpMocks from 'node-mocks-http';

describe('Error Handler Middleware', () => {
    it('sollte die Fehler korrekt verarbeiten und eine Antwort senden', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        const error = new Error('Testfehler');
        error.status = 400;

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            success: false,
            message: 'Testfehler',
        });
    });

    it('sollte eine 500 Fehlerantwort senden, wenn kein Status angegeben ist', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        const error = new Error('Interner Serverfehler');

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            success: false,
            message: 'Interner Serverfehler',
        });
    });
});
