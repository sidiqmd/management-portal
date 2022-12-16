const db = require("../db/connect");

const isCategoryExist = async (name) => {
  const categoryList = await db.query("SELECT * FROM category WHERE name = ?", [
    name,
  ]);
  await db.end();

  if (categoryList && categoryList.length > 0) {
    return true;
  }
  return false;
};

module.exports.createCategory = async (req, res) => {
  const { name, description, activated } = req.body;
  console.log("createCategory ->", name, description, activated);

  const isExists = await isCategoryExist(name);
  if (isExists) {
    return res.status(400).json({
      message: `Category '${name}' already exist`,
    });
  }

  await db.query(
    "INSERT INTO category(name, description, activated) VALUES(?,?,?)",
    [name, description, activated]
  );
  await db.end();

  return res.status(200).json({
    message: "Category created successfully",
  });
};

module.exports.updateCategory = async (req, res) => {
  const { categoryId, name, description, activated } = req.body;
  console.log("updateCategory ->", categoryId, name, description, activated);

  const category = await db.query(
    "SELECT * FROM category WHERE category_id = ?",
    [categoryId]
  );
  await db.end();
  if (category && category.length === 0) {
    return res.status(400).json({
      message: `Category not found`,
    });
  }

  await db.query(
    "UPDATE category SET name = ?, description = ?, activated = ?, updated_at = ? WHERE category_id = ?",
    [name, description, activated, new Date(), categoryId]
  );
  await db.end();

  return res.status(200).json({
    message: "Category updated successfully",
  });
};

module.exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  console.log("deleteCategory ->", categoryId);

  const category = await db.query(
    "SELECT * FROM category WHERE category_id = ?",
    [categoryId]
  );
  await db.end();
  if (category && category.length === 0) {
    return res.status(400).json({
      message: `Category not found`,
    });
  }

  const post = await db.query("SELECT * FROM post WHERE category_id = ?", [
    categoryId,
  ]);
  await db.end();
  if (post.length > 0) {
    return res.status(400).json({
      message: `Category is been used in post, unable to delete`,
    });
  }

  await db.query("DELETE FROM category WHERE category_id = ?", [categoryId]);
  await db.end();

  return res.status(200).json({
    message: "Category deleted successfully",
  });
};

module.exports.getCategoryList = async (req, res) => {
  console.log("getCategoryList");

  const categoryList = await db.query("SELECT * FROM category");
  await db.end();

  return res.status(200).json({
    categoryList,
  });
};

module.exports.getCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log("getCategory ->", categoryId);

  const category = await db.query(
    "SELECT * FROM category WHERE category_id = ?",
    [categoryId]
  );
  await db.end();

  return res.status(200).json({
    category: category[0],
  });
};
