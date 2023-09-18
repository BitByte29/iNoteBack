const { validationResult, body } = require("express-validator");
const User = require("./../models/userModel");
const Note = require("./../models/noteModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWTSS;

exports.getUsers = async (req, res) => {
  let users = await User.find();
  let notes = await Note.find();
  res.json(users);
};

exports.getUsersCount = async (req, res) => {
  try {
    const [userCount, noteCount] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
    ]);

    res.json({ userCount, noteCount });
  } catch (error) {
    console.error("Error fetching user and note counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Gets the user details Login required
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//Authenticate user on POST 'api/user/login'
exports.login = async (req, res) => {
  //Validates using validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("error found");
    return res.status(400).json({
      message: errors
        .array()
        .map((err) => {
          return err.msg;
        })
        .join(" "),
    });
  }

  const { email, password } = req.body;
  // console.log(email, password);
  try {
    //Find the user
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Please login with correct crediatials" });
    }
    // Internally make hash of req.body.password and compare with user.password hash return T/F
    const passwordCompare = await bcrypt.compare(password, user.password); //Returns Promise if no await then false everytime
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ message: "Please login with correct crediatials" });
    }

    //Again do the JWT token things
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//Add user on POST 'api/user/createuser'
exports.addUser = async (req, res) => {
  //Validates using validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors
        .array()
        .map((err) => {
          return err.msg;
        })
        .join(" "),
    });
  }
  try {
    //Check if user with the given email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Account with the given email already exists." });
    }
    //Before creting a new user we have to hash the password

    const salt = await bcrypt.genSalt();
    const secPass = await bcrypt.hash(req.body.password, salt);

    //Creating the user await as all returns a promise
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    //we will not send the userdata back instead we send a token
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, JWT_SECRET);
    res.json({
      message: "Created Successfully",
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
