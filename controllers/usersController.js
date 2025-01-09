const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const middleware = require("../middlewares/userRole");
const validator = require("../validator/user");

const mongoDbInstant = require("../db/mongodb");
const { validationResult } = require("express-validator");

const router = express.Router();

const client = mongoDbInstant.getMongoClient();
const collectionName = "users";

const saltRounds = 10;

const jwtAuth = passport.authenticate("jj", { session: false });


router.get("/",
  jwtAuth,
  middleware.isUserorAdmin,
  async (req, res) => {
    try {

      await client.connect();

      const db = client.db(mongoDbInstant.getDbName());
      const collection = db.collection(collectionName);

      const result = await collection.find({}).toArray();

      res.send({
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    } finally {
      await client.close();
    }
  });

router.post("/",
  jwtAuth,
  middleware.isAdmin,
  validator.createUser,
  async (req, res) => {
    try {

      const errorResult = validationResult(req);

      if (!errorResult.isEmpty()) {
        return res.status(400).send({
          message: "Validation error",
          errors: errorResult.array(),
        });
      }

      const userData = {
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        role: req.body.role,
      };

      await client.connect();
      const db = client.db(mongoDbInstant.getDbName());
      const collection = db.collection(collectionName);

      const usersCount = await collection.countDocuments({
        username: userData.username,
      });

      if (usersCount > 0) {
        return res.status(400).send({
          message: "Username already exists",
        });
      }

      const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
      userData.password = hashPassword;

      const result = await collection.insertOne(userData);

      res.send({
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        message: error?.message ?? "ระบบขัดข้อง",
      });
    } finally {
      await client.close();
    }
  });

router.put("/:id",
  jwtAuth,
  middleware.isAdmin,
  validator.updateUser,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = {
        password: req.body.password,
        full_name: req.body?.full_name ?? "",
      };

      await client.connect();

      const db = client.db(mongoDbInstant.getDbName());
      const collection = db.collection(collectionName);

      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: userData }
      );

      res.send({
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    } finally {
      await client.close();
    }
  });

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await client.connect();

    const db = client.db(mongoDbInstant.getDbName());
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    res.send({
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  } finally {
    await client.close();
  }
});

module.exports = router;
