const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");
const category = require("../models/category");

exports.category_list = function (req, res, next) {
  Category.find({})
    .sort({ name: 1 })
    .exec(function (err, list_categories) {
      if (err) return next(err);
      res.render("category", {
        title: "Categories",
        category_list: list_categories,
      });
    });
};
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category_items(callback) {
        Item.find({ category: req.params.id }).sort({ name: 1 }).exec(callback);
      },
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("./category_detail", {
        title: "Category detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "Create category" });
};
exports.category_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create category",
        category,
        errors: errors.array(),
      });
    } else {
      category.save((err) => {
        if (err) return next(err);
        res.redirect(category.url);
      });
    }
  },
];

exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.category == null) res.redirect("/category/");
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.category_items.length > 0) {
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_items: results.category_items,
        });
        return;
      }
      Category.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        res.redirect("/category");
      });
    }
  );
};

exports.category_update_get = (req, res) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) return next(err);
    if (category == null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_form", { title: "Update category", category });
  });
};
exports.category_update_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, //This is required, or a new ID will be assigned
    });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update category",
        category,
        errors: errors.array(),
      });
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        (err, thecategory) => {
          if (err) return next(err);
          res.redirect(thecategory.url);
        }
      );
    }
  },
];
