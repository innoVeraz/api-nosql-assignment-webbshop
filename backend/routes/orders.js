const express = require("express");
const router = express.Router();
const orderModel = require("../models/order");
const userModel = require("../models/user");
const productModel = require("../models/product");
const ObjectId = require("mongoose").Types.ObjectId;

//HÄMTA ALLA ORDERS
router.get("/all", async (req, res) => {
  const orders = await orderModel.find();
  res.send(orders);
});

//SKAPA ORDER
router.post("/add", async (req, res) => {
  //user i body blir variabel userId
  const userId = req.body.user;
  //kontrollera så att användaren finns, om inte, logga och svara med 400
  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  const products = req.body.products;

  //loopa igenom produkterna i varukorgen och kontr lagersaldo i db
  //Om man beställer mer än det finns i lager, stoppa in produkt i error array
  let quantityErrors = [];
  for (let product of products) {
    const dbProduct = await productModel.findOne({ _id: product.productId });
    if (product.quantity > dbProduct.lager) {
      quantityErrors.push(dbProduct);
    }
  }

  //När loopen körts kontrollera om error array har innehåll. Om, meddela out of stock
  if (quantityErrors.length > 0) {
    return res.send({
      message: "Our product is so awesome, it went out of stock.",
      products: quantityErrors,
    });
  }

  //Om allt är ok loopa produkter i "varukorg" igen, uppdaterar lagerstatus
  for (let product of products) {
    const dbProduct = await productModel.updateOne(
      { _id: product.productId },
      { $inc: { lager: -product.quantity } }
    );
  }
  //skapar order i db
  const order = await orderModel.create(req.body);
  res.send(order);
});

module.exports = router;
