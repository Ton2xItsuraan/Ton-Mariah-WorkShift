import Users from "../models/userModel.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res.status(400).json({ success: false, message: "Email address already exists" });
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = user.createJWT();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide valid credentials" });
  }

  try {
      const user = await Users.findOne({ email }).select("+password");

      if (!user) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      user.password = undefined;

      const token = user.createJWT();

      return res.status(201).json({
          success: true,
          message: "Login successful",
          user,
          token,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};