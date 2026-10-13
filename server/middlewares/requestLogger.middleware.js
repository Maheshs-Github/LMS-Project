import logger from "../utils/logger.js";


const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startTime,
       userId: req.user?._id?.toString(),
    });
  });

  next();
};

export default requestLogger;
