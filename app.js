//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//---------------------------------------------------------------

//mongoose setup
mongoose
  .connect(
    "mongodb+srv://Mahi:test123@cluster0.8i9qq4g.mongodb.net/todolistDb",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

//schema
const itemSchema = new mongoose.Schema({ name: String });
//model
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({ name: "To cook for dinner" });
const item2 = new Item({ name: "To clean" });
const item3 = new Item({ name: "To study" });
const arr1 = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

//---------------------------------------------------------------

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(arr1, function (err) {
        if (err) retrun(err);
        else return console.log("success");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  if (req.params.customListName != "favicon.ico") {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, (err, foundList) => {
      if (!err) {
        if (!foundList) {
          const list = new List({
            name: customListName,
            items: arr1,
          });
          console.log(foundList);
          list.save();
          res.redirect("/" + customListName);
        } else {
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      }
    });
  }
});

//-----------------------------------------------

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const itemDoc = new Item({ name: itemName });
  if (listName === "Today") {
    itemDoc.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(itemDoc);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const delItemId = req.body.chkBox;
  const listName = req.body.listName;
  console.log(delItemId);
  if (listName === "Today") {
    Item.findByIdAndDelete(delItemId, function (err) {
      if (err) return err;
      else console.log("deleted item");
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: delItemId } } },
      function (err) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

//--------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
