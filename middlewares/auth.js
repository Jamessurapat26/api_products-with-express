const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;

const mongoDbInstant = require("../db/mongodb");

const client = mongoDbInstant.getMongoClient();
const secretKey = "api-key";

const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const userSignIn = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, done) => {
    try {
      await client.connect();
      const db = client.db(mongoDbInstant.getDbName());
      const collection = db.collection("users");

      const user = await collection.findOne({ username });

      if (!user) {
        return done(null, false, { message: "Username not found." });
      }

      if (bcrypt.compareSync(password, user?.password ?? "-") === false) {
        return done(null, false, { message: "Incorrect password" });
      }

      user.password = null;
      return done(null, user);
    } catch (error) {
      return done(error);
    } finally {
      await client.close();
    }
  }
);

const jwtSignIn = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = {
    payload,
  };
  console.log("first");
  if (user) {
    user.password_hash = null;

    return done(null, user);
  } else {
    return done(null, false);
  }
});

passport.use("user-local", userSignIn);
passport.use("jj", jwtSignIn);

module.exports = passport;
