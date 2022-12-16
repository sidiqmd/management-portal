const db = require("../db/connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const isUsernameExist = async (username) => {
  const userList = await db.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  await db.end();

  if (userList && userList.length > 0) {
    return true;
  }
  return false;
};

module.exports.register = async (username, password, email, fullName, res) => {
  console.log("register ->", username, email, fullName);

  const isExists = await isUsernameExist(username);
  if (isExists) {
    return res.status(400).json({
      message: `Username already exist`,
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO user(username, password, email, full_name) VALUES(?,?,?,?)",
    [username, encryptedPassword, email, fullName]
  );
  await db.end();

  return res.status(200).json({
    message: "Registration successful",
  });
};

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

module.exports.login = async (username, password, res) => {
  console.log("login ->", username);

  const user = await db.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  await db.end();

  if (
    user &&
    user.length > 0 &&
    (await bcrypt.compare(password, user[0].password))
  ) {
    const tokens = generateToken({ username });

    await db.query("UPDATE user SET refresh_token = ? WHERE username = ?", [
      tokens.accessToken,
      username,
    ]);
    await db.end();

    return res.status(200).json({
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } else {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }
};

module.exports.refreshToken = async (req, res) => {
  console.log("refreshToken ->", req.user.username);

  const { username } = req;

  const user = await db.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  await db.end();

  if (user && user.length > 0 && user[0].refresh_token === req.refreshToken) {
    const tokens = generateToken({ username });

    await db.query("UPDATE user SET refresh_token = ? WHERE username = ?", [
      tokens.accessToken,
      username,
    ]);
    await db.end();

    return res.status(200).json({
      message: "Successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } else {
    return res.status(401).json({
      error: "Invalid refresh token.",
    });
  }
};
