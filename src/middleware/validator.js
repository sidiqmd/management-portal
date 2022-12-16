const { body } = require("express-validator");

const validate = (type) => {
  switch (type) {
    case "register": {
      return [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
      ];
    }
    case "login": {
      return [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
      ];
    }
    case "create-category": {
      return [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").optional(),
        body("activated").default(true).toBoolean(),
      ];
    }
    case "update-category": {
      return [
        body("categoryId").notEmpty().withMessage("CategoryId is required"),
        body("name").notEmpty().withMessage("Name is required"),
        body("description").optional(),
        body("activated").default(true).toBoolean(),
      ];
    }
    case "delete-category": {
      return [
        body("categoryId").notEmpty().withMessage("CategoryId is required"),
      ];
    }
    case "create-post": {
      return [
        body("title").notEmpty().withMessage("Title is required"),
        body("body").notEmpty().withMessage("Body is required"),
        body("status")
          .notEmpty()
          .withMessage("Status is required")
          .isIn(["Draft", "Published", "Pending Review"])
          .withMessage("Status must be Draft, Published or Pending Review"),
        body("label")
          .notEmpty()
          .withMessage("Label is required")
          .isIn(["Premium", "Normal"])
          .withMessage("Label must be Premium or Normal"),
        body("categoryId").notEmpty().withMessage("CategoryId is required"),
      ];
    }
    case "update-post": {
      return [
        body("postId").notEmpty().withMessage("PostId is required"),
        body("title").notEmpty().withMessage("Title is required"),
        body("body").notEmpty().withMessage("Body is required"),
        body("status")
          .notEmpty()
          .withMessage("Status is required")
          .isIn(["Draft", "Published", "Pending Review"])
          .withMessage("Status must be Draft, Published or Pending Review"),
        body("label")
          .notEmpty()
          .withMessage("Label is required")
          .isIn(["Premium", "Normal"])
          .withMessage("Label must be Premium or Normal"),
        body("categoryId").notEmpty().withMessage("CategoryId is required"),
      ];
    }
    case "delete-post": {
      return [body("postId").notEmpty().withMessage("PostId is required")];
    }
  }
};

module.exports = validate;
