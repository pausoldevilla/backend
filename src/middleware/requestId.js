const { v4: uuidv4 } = require('uuid');

// 📸 SCREENSHOT: Middleware requestId per traçar peticions
const requestId = (req, res, next) => {
  const incomingRequestId = req.headers['x-request-id'];
  req.requestId = incomingRequestId || uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};

module.exports = requestId;
