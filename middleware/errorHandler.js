function logs(err, req, res, next) {
    console.error(err);
    next(err);
}
  
function sendError(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
}

function boomErrorFormat(err, req, res, next) {
    if (err.isBoom) {
      const { output } = err;
      res.status(output.statusCode).json(output.payload);
    } else {
        next(err);
    }
  }
  
  
  module.exports = { boomErrorFormat, logs, sendError }