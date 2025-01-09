const express = require("express");
const mongoDbInstant = require("../db/mongodb");
const { ObjectId } = require("mongodb");
const validator = require("../validator/products");

const router = express();
const client = mongoDbInstant.getMongoClient();
const collectionName = "products";

const products = [
  { id: 1, name: "Poppy", price: 1000, category: "Invention" },
  { id: 2, name: "Catnap", price: 500, category: "Smiling Critter" },
];

router.get("/", async (req, res) => {
  const { price } = req.query;

  await client.connect();

  const db = client.db(mongoDbInstant.getDbName());
  const collection = db.collection(collectionName);

  const products = await collection
    .find({
      // price: { $gte: parseInt(price) },
    })
    .toArray();

  res.send({
    message: "Products found",
    data: products,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  await client.connect();

  const db = client.db(mongoDbInstant.getDbName());
  const collection = db.collection(collectionName);

  const product = await collection
    .find({
      _id: new ObjectId(id),
    })
    .toArray();

  res.send({
    message: "Product found",
    data: product,
  });
});

router.post("/",
  validator.createProduct,
  async (req, res) => {
    const { name, price, category } = req.body;

    await client.connect();

    const db = client.db(mongoDbInstant.getDbName());
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({ name, price, category });

    res.status(201).send({
      message: "Product created successfully",
      result,
    });
  });

router.put("/:id",
  validator.updateProduct,
  (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, category } = req.body;

    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...(name && { name }),
      ...(price && { price }),
      ...(category && { category }),
    };

    res.send({
      message: "Product updated successfully",
      data: products[productIndex],
    });
  });

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return res.status(404).send({
      message: "Product not found",
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.send({
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

module.exports = router;
