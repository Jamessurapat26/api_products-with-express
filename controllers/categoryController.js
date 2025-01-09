const express = require('express');
const { ObjectId } = require('mongodb');
const mongoDbInstant = require('../db/mongodb');
const passport = require("passport");
const validator = require("../validator/category");



const router = express.Router();
const client = mongoDbInstant.getMongoClient();
const dbName = mongoDbInstant.getDbName();
const collectionName = "category";

const checkUser = passport.authenticate("jwt-verify", { session: false });


// Get all categories
router.get("/", checkUser, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const categories = await collection.find({}).toArray();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
});

// Get category by ID (using category_id)
router.get("/:category_id", checkUser, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const category = await collection.findOne({ category_id: parseInt(req.params.category_id) });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: "Error fetching category", error: err.message });
    }
});

// Create a new category
router.post("/", validator.createCategory, checkUser, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const newCategory = req.body; // Expecting JSON with category_id and category
        const result = await collection.insertOne(newCategory);
        res.status(201).json({ message: "Category created", categoryId: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: "Error creating category", error: err.message });
    }
});

// Update a category by category_id
router.put("/:category_id", validator.updateCategory, checkUser, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const updatedCategory = req.body; // Expecting JSON body with fields to update
        const result = await collection.updateOne(
            { category_id: parseInt(req.params.category_id) },
            { $set: updatedCategory }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category updated" });
    } catch (err) {
        res.status(400).json({ message: "Error updating category", error: err.message });
    }
});

// Delete a category by category_id
router.delete("/:category_id", checkUser, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ category_id: parseInt(req.params.category_id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting category", error: err.message });
    }
});

module.exports = router;
