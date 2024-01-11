import bcrypt from "bcrypt";
import User from "../models/User.js"
import jwt from "jsonwebtoken";
import config from "../utils/config.js";

async function getUsers(request, response, next) {
  try {
      const users = await User.find({}).select('+password').populate("persons", { email: 1, firstname: 1, lastname: 1, important: 1, number: 1 });
      return response.json(users);
  } catch (error) {
      next(error);
  }
}

async function createUser(request, response, next) {
  const { email, username, firstname, lastname, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
      email,
      username,
      firstname,
      lastname,
      passwordHash,
  });

  try {
      const savedUser = await user.save();

      // Modify the response to include firstname and lastname
      return response.status(201).json({
          _id: savedUser._id,
          email: savedUser.email,
          username: savedUser.username,
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
      });
  } catch (error) {
      next(error);
  }
}

async function loginUser(request, response, next) {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return response.status(401).json({ error: "Invalid username or password" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      return response.status(401).json({ error: "Invalid username or password" });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, config.JWT_SECRET, {expiresIn: 1800,});

    return response
      .status(200)
      .json({ token, username: user.username, firstname: user.firstname });
  } catch (error) {
    next(error);
  }
}

export default {
    createUser,
    getUsers,
    loginUser,
};