import Users from "../models/userModel.js";


export const register = async (req, res, next) => {
    // Extract fields from req.body
    const { firstName, lastName, email, password } = req.body;
  
    // Validate fields
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }
  
    try {
      const userExist = await Users.findOne({ email });
  
      if (userExist) {
        res.status(400).json({ success: false, message: "Email address already exists" });
        return;
      }
  
      const user = await Users.create({
        firstName,
        lastName,
        email,
        password,
      });
  
      // user token
      const token = user.createJWT();
  
      res.status(201).send({
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
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const signIn = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        //validation
        if(!email || !password) {
            next("Please Provide use credentials");
            return;
        }

        //find user by email
        const user = await User.findOne({ email }.select("+password"));

        if(!user) {
            next("Invalid email or password");
            return;
        }

        //compare password
        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            next("Invalid email or password");
            return;
        }

        user.password = undefined;

        const token = user.createJWT();

        res.status(201).json({
            success: true,
            message: "Login successfully",
            user,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message})
    }
};