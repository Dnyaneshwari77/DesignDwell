const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1]; // ger Bearer tokenvalue

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    req.user = {
      userID: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      Email: payload.email,
    };
    // Set CORS headers
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://designdwell-final.onrender.com"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
