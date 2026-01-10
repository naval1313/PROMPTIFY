import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//SignUp
export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    //1. check if user exist or not
    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({ success: false, msg: "Email already Registered!" }); //user already exist.
    }

    //2. password hash
    const hashPass = await bcrypt.hash(password, 10);

    //3. User save
    const user = await User.create({
      name,
      email,
      password: hashPass,
    });

    //create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, msg: "User created", token });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

//LogIn
export async function logIn(req, res) {
  try {
    const { email, password } = req.body;

    //1. Check user
    const user = await User.findOne({ email });

    if (!user) {
      //agr user nhi milta
      return res.json({ success: false, msg: "User not found!" });
    }

    //2.Compare password
    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      //agr password match nhi hua
      return res.json({ success: false, msg: "Wrong Password" });
    }

    // 3. Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      msg: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
}
