// Datei: feedback-app/__tests__/responseHelper.test.js

import { sendSuccess, sendError } from '../src/utils/responseHelper'; 

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

const mockData = { 
    id: 1, 
    title: 'Test Title', 
    text: 'Test text' 
};

describe('Response Helper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('sendet eine Erfolgs-Antwort mit dem Standard-Statuscode', () => {
        sendSuccess(mockRes, mockData);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Anfrage erfolgreich.',
            data: mockData
        });
    });

    it('sendet eine Fehler-Antwort mit dem angegebenen Statuscode', () => {
        const errorMessage = 'Ein Fehler ist aufgetreten.';
        const statusCode = 400;
        
        sendError(mockRes, errorMessage, statusCode);

        expect(mockRes.status).toHaveBeenCalledWith(statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: errorMessage
        });
    });
});
