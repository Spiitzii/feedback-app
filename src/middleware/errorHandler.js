export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false, // Füge dieses Feld hinzu
        message: err.message || "Internal Server Error", // Verwende 'message' anstelle von 'error'
    });
};
