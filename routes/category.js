const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

router.get("/", categoryController.category_list);

router.get("/create", categoryController.category_create_get);
router.post("/create", categoryController.category_create_post);
router.get("/:id/delete", categoryController.category_delete_get);
router.post("/:id/delete", categoryController.category_delete_post);
router.get("/:id/update", categoryController.category_update_get);
router.post("/:id/update", categoryController.category_update_post);

router.get("/items", itemController.item_list);
router.get("/item/create", itemController.item_create_get);
router.post("/item/create", itemController.item_create_post);
router.get("/item/:id", itemController.item_detail);
router.get("/item/:id/delete", itemController.item_delete_get);
router.post("/item/:id/delete", itemController.item_delete_post);
router.get("/item/:id/update", itemController.item_update_get);
router.post("/item/:id/update", itemController.item_update_post);

router.get("/:id", categoryController.category_detail);

module.exports = router;
