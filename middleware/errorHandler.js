import multer from "multer";
 
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
}
 
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
 
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";
 
  if (err instanceof multer.MulterError) {
    status = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image must be 5MB or smaller";
    }
  } else if (message === "Only PNG and JPEG images are allowed") {
    status = 400;
  }
 
  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }
 
  const payload = {
    error: status >= 500 ? "Internal Server Error" : message,
  };
 
  if (status < 500 || process.env.NODE_ENV !== "production") {
    payload.message = message;
  }
 
  res.status(status).json(payload);
}
 
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
 
 