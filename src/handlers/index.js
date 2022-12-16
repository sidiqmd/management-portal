const serverless = require("serverless-http");
const express = require("express");
const db = require("../db/connect");
const { login, register, refreshToken } = require("../service/auth");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryList,
  getCategory,
} = require("../service/category");
const {
  createPost,
  updatePost,
  deletePost,
  getPostList,
  getPost,
} = require("../service/post");
const { verifyAccessToken, verifyRefreshToken } = require("../middleware/jwt");
const validate = require("../middleware/validator");
const { validationResult } = require("express-validator");
const {
  purchasePremiumMembership,
  billplzCallback,
} = require("../service/membership");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post("/register", validate("register"), async (req, res, next) => {
  return register(
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.fullName,
    res
  );
});

app.post("/login", validate("login"), async (req, res, next) => {
  const { username, password } = req.body;

  console.log(username, password);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  return login(username, password, res);
});

app.post("/refresh", verifyRefreshToken, async (req, res, next) => {
  return refreshToken(req, res);
});

/**
 * Category
 */

app.get("/category", verifyAccessToken, async (req, res, next) => {
  return getCategoryList(req, res);
});

app.get("/category/:categoryId", verifyAccessToken, async (req, res, next) => {
  return getCategory(req, res);
});

app.post(
  "/category",
  validate("create-category"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return createCategory(req, res);
  }
);

app.put(
  "/category",
  validate("update-category"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return updateCategory(req, res);
  }
);

app.delete(
  "/category",
  validate("delete-category"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return deleteCategory(req, res);
  }
);

/**
 * Post
 */

app.get("/post", verifyAccessToken, async (req, res, next) => {
  return getPostList(req, res);
});

app.get("/post/:postId", verifyAccessToken, async (req, res, next) => {
  return getPost(req, res);
});

app.post(
  "/post",
  validate("create-post"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return createPost(req, res);
  }
);

app.put(
  "/post",
  validate("update-post"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return updatePost(req, res);
  }
);

app.delete(
  "/post",
  validate("delete-post"),
  verifyAccessToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return deletePost(req, res);
  }
);

app.post("/purchase-membership", verifyAccessToken, async (req, res, next) => {
  return purchasePremiumMembership(req, res);
});

app.post("/billplz-callback", async (req, res, next) => {
  return billplzCallback(req, res);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
