const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.item_list = function (req, res, next) {
  Item.find({})
    .sort({ name: 1 })
    .exec((err, list_items) => {
      if (err) return next(err);
      res.render("item", { title: "Items", item_list: list_items });
    });
};
exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("category")
    .exec((err, item) => {
      if (err) return next(err);
      res.render("item_detail", { title: "Item detail", item: item });
    });
};

exports.item_create_get = (req, res, next) => {
  Category.find({}).exec((err, results) => {
    if (err) return next(err);
    res.render("item_form", { title: "Create item", categories: results });
  });
};

exports.item_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock_count", "Amount of added item must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Select category").isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock_count: req.body.stock_count,
    });
    if (!errors.isEmpty()) {
      Category.find({}).exec((err, results) => {
        if (err) return next(err);
        res.render("item_form", {
          title: "Create item",
          categories: results,
          item,
          errors: errors.array(),
        });
      });
    } else {
      item.save((err) => {
        if (err) return next(err);
        res.redirect(item.url);
      });
    }
  },
];
exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) return next(err);
    res.render("item_delete", { title: "Delete item", item });
  });
};
exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndRemove(req.params.id).exec((err, item) => {
    if (err) return next(err);
    Category.findById(item.category).exec((err, category) => {
      if (err) return next(err);
      res.redirect(category.url);
    });
  });
};

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      categories(callback) {
        Category.find({}).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_form", {
        title: "Update item",
        item: results.item,
        categories: results.categories,
      });
    }
  );
};
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item update POST");
};
