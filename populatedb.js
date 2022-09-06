#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

function itemCreate(name, description, category, price, stock_count, cb) {
  var item_detail = {
    name: name,
    description: description,
    category: category,
    price: price,
    stock_count: stock_count,
  };

  var item = new Item(item_detail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  var category_detail = { name: name };
  if (description) category_detail.description = description;
  var category = new Category(category_detail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}
function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate("Laptops", "All types and prices available", callback);
      },
      function (callback) {
        categoryCreate("Smart Watches", "Elegant, and capable", callback);
      },
      function (callback) {
        categoryCreate(
          "Monitors",
          "Wide or curved, however you like it",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Computer Accessories",
          "Mouses, headphones, laptop bags, wireless buds... At your finger tips",
          callback
        );
      },
    ],
    cb
  );
}
function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "LAPTOP MSI GF75 Thin 10SCSR-448 GAMING 9S7-17F312-469",
          "Core™ i5-10300H 2.5 GHZ 8GB 512GB SSD 17.3″ (1920x1080) 144HZ NVIDIA® GTX 1650 Ti 4GB BLACK BT WIN10 Webcam Single backlight Keyboard O/B",
          categories[0],
          799,
          7,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "ASUS ZENBOOK DUO UX482EGR-XB77T",
          "Core™i7-1195G7 2.9GHz 32GB 1TB SSD 14″ FHD (1920x1080) TOUCHSCREEN NVIDIA® MX450 2GB ScreenPad Plus 12.65” (1920 x 515) SUPPORT STYLUS Celestial Blue BT WIN11 Pro HD Camera Backlit Keyboard",
          categories[0],
          1899,
          5,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "TAG HEUER CONNECTED",
          "Customized for your best performance, this cutting edge TAG Heuer Connected Watch pushes the boundaries of technology. An elegant chronograph style 42mm steel case, with steel buttons and crown, make this the ultimate luxury smartwatch.",
          categories[1],
          2050,
          5,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "LENOVO S2 PRO SMARTWATCH WATERPROOF BLACK",
          "Features: Message notification - Alarm alerts - WhatsApp alerts - Activity tracker - Call alerts - Sleep monitoring - Temperature - Heart rate",
          categories[1],
          69,
          3,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Dell SE2719HR",
          "For a monitor that's great for everyday use and won't cost an arm and a leg, the Dell SE2719HR is our pick. Sometimes you just need a reliable, inexpensive display, and based on user reviews, this is a great one to get. The 27-inch Dell boasts an IPS panel, so the display will look great from any angle. While it won't match the resolution of a 4K monitor, the display is still sharp and clear, with vibrant color and deep black levels. With only HDMI and VGA inputs, it's not ideal for gaming (DisplayPort is better suited to the higher frame rates of a GPU), but most any other use should be ably handled by the 27-inch display, thanks to its minimal lag times and 75Hz refresh rate.",
          categories[2],
          249,
          5,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Acer XFA240",
          "The Acer XFA240 demonstrates that excellent full HD monitors don't need to cost a ton of money. For less than $200, this 1080p monitor delivers accurate colors and more extra features than you'd expect, including a full vertical mode that makes it invaluable as a second screen. The monitor works well for both gaming and productivity, with a 144 Hz refresh rate and a variety of ports, including a DVI input for older machines.",
          categories[2],
          149,
          7,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Logitech Mx Anywhere 2s Wireless Mobile Mouse 910-005153",
          "Lo mx anywhere 2s wrls mobile mouse 910-005153 *unifying usb receiver or bluetooth low energy technology *battery: up to 70 days on a single full charge *battery: rechargeable li-po (500 mah) battery. *number of buttons: 7 *scroll wheel: hyper-fast scrolling, from precision to free scroll in one click *micro-usb cable for recharging included",
          categories[3],
          97,
          8,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) console.log("FINAL ERR: " + err);

    // All done, disconnect from database
    mongoose.connection.close();
  }
);
