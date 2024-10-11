function errorHandler(err, req, res, next) {
    console.error(err.stack);  // Optional: Log the error

    res.status(500).json({
        error: 'Internal Server Error'  // Make sure this matches the expected message
    });
}

module.exports = errorHandler;
