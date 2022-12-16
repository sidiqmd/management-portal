const db = require("../db/connect");

module.exports.createPost = async (req, res) => {
  const { title, body, status, label, categoryId } = req.body;
  console.log("createPost ->", title, body, status, label, categoryId);

  if (label === "Premium" && req.user.membership !== "Premium") {
    return res.status(400).json({
      message: `Only premium user are allowed to create premium post`,
    });
  }

  await db.query(
    "INSERT INTO post(title, body, status, label, category_id) VALUES(?,?,?,?,?)",
    [title, body, status, label, categoryId]
  );
  await db.end();

  return res.status(200).json({
    message: "Post created successfully",
  });
};

module.exports.updatePost = async (req, res) => {
  const { postId, title, body, status, label, categoryId } = req.body;
  console.log("updatePost ->", postId, title, body, status, label, categoryId);

  if (label === "Premium" && req.user.membership !== "Premium") {
    return res.status(400).json({
      message: `Sorry only premium user can update premium post`,
    });
  }

  const post = await db.query("SELECT * FROM post WHERE post_id = ?", [postId]);
  await db.end();
  if (post && post.length === 0) {
    return res.status(400).json({
      message: `Post not found`,
    });
  }

  await db.query(
    "UPDATE post SET title = ?, body = ?, status = ?, label = ?, updated_at = ?, category_id = ? WHERE post_id = ?",
    [title, body, status, label, new Date(), categoryId, postId]
  );
  await db.end();

  return res.status(200).json({
    message: "Post updated successfully",
  });
};

module.exports.deletePost = async (req, res) => {
  const { postId } = req.body;
  console.log("deletePost ->", postId);

  const post = await db.query("SELECT * FROM post WHERE post_id = ?", [postId]);
  await db.end();
  if (post && post.length === 0) {
    return res.status(400).json({
      message: `Post not found`,
    });
  }

  await db.query("DELETE FROM post WHERE post_id = ?", [postId]);
  await db.end();

  return res.status(200).json({
    message: "Post deleted successfully",
  });
};

module.exports.getPostList = async (req, res) => {
  console.log("getPostList");

  const membership = req.user.membership;

  let postList = [];
  if (membership === "Premium") {
    postList = await db.query(
      "SELECT * FROM post WHERE label = ? OR label = ?",
      ["Premium", "Normal"]
    );
  } else {
    postList = await db.query("SELECT * FROM post WHERE label = ?", ["Normal"]);
  }
  await db.end();

  return res.status(200).json({
    postList,
  });
};

module.exports.getPost = async (req, res) => {
  const { postId } = req.params;
  console.log("getPost ->", postId);

  const membership = req.user.membership;

  let postList = [];
  if (membership === "Premium") {
    postList = await db.query(
      "SELECT * FROM post WHERE (label = ? OR label = ?) AND post_id = ?",
      ["Premium", "Normal", postId]
    );
  } else {
    postList = await db.query(
      "SELECT * FROM post WHERE label = ? AND post_id = ?",
      ["Normal", postId]
    );
  }
  await db.end();

  return res.status(200).json({
    post: postList[0],
  });
};
