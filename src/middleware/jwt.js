const jwt = require("jsonwebtoken");
const db = require("../db/connect");

module.exports.verifyAccessToken = async (req, res, next) => {
  let accessToken =
    req.body.accessToken || req.query.accessToken || req.headers.authorization;

  if (!accessToken) {
    return res.status(403).json({
      error: "A token is required for authentication",
    });
  }

  accessToken = accessToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

    const user = await db.query("SELECT * FROM user WHERE username = ?", [
      decoded.username,
    ]);
    await db.end();

    if (user.length === 0) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user[0];
  } catch (err) {
    return res.status(401).json({
      error: err.message,
    });
  }

  return next();
};

module.exports.verifyRefreshToken = async (req, res, next) => {
  let refreshToken =
    req.body.refreshToken ||
    req.query.refreshToken ||
    req.headers.authorization;

  if (!refreshToken) {
    return res.status(403).json({
      error: "A token is required for authentication",
    });
  }

  refreshToken = refreshToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    const user = await db.query("SELECT * FROM user WHERE username = ?", [
      decoded.username,
    ]);
    await db.end();

    if (user.length === 0) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user[0];
    req.refreshToken = refreshToken;
  } catch (err) {
    return res.status(401).json({
      error: err.message,
    });
  }

  return next();
};
