const { User } = require("../models/index.js");
const createError = require("../utils/createError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = await User.create({
      ...req.body,
      password: hash,
    });

    const { password, ...userInfo } = newUser.dataValues;
    res.status(201).json({ message: "User has been created.", user: userInfo });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return next(createError(409, "Email already exists!"));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or email!"));

    const token = jwt.sign(
      {
        id: user.id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user.dataValues;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .send("User has been logged out.");
};

module.exports = {
  register,
  login,
  logout
};
