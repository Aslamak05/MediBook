export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  // Mongoose duplicate error
  if (err.code === 11000) {
    return res.status(409).json({
      error: `${Object.keys(err.keyValue)[0]} already exists`,
    });
  }

  // Custom HTTP errors
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Default error
  res.status(500).json({ error: 'Internal server error' });
};

export const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
