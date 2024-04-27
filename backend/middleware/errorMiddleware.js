const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    
    if(err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status().json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

const statusHandler = (err, req, res, next) => {
    res.locals.error = err;
    if (err.status >= 100 && err.status < 600)
    res.status(err.status);
  else {
    const status = err.status || 500;
    res.status(status);
    res.render('error');
  }
  };

export { notFound, errorHandler, statusHandler };