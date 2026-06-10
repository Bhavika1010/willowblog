export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(statusCode).json({ message });
};
