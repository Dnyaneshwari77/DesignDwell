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

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
