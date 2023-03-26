const express = require("express");
const router = express.Router();
const productModel = require("../models/product");
const crypto = require("crypto");

//HÄMTA ALLA PRODUKTER
router.get("/", async (req, res) => {
  const products = await productModel.find();
  res.send(products);
});

//HÄMTA SPECIFIK PRODUKT

router.get("/:id", async (req, res) => {
  const product = await productModel.findOne({ _id: req.params.id });
  res.send(product);
});

//SKAPA PRODUKT
router.post("/add", async (req, res) => {
  const product = await productModel.create(req.body);
  res.send(product);
});

module.exports = router;
