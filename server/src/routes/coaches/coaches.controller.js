const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");

require("dotenv").config();

const { getAllCoaches, getCoachByPhoneNumber } = require("./../../models/coaches.model")
const { Coach, Profile } = require("../../models/coaches.mongo");

const httpGetAllCoaches = async (req, res) => {
  let coaches = await getAllCoaches();
  return res.status(200).json(coaches);
}

const httpPostCoachSignup = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const existingUser = await getCoachByPhoneNumber(phoneNumber);
  if (!existingUser) {
    // User does not exists so signup goes on.
    // OTP verification
    // Insert user into the DB
    try {
      const coach = await new Coach({
        phoneNumber,
        password,
      }).save();
      return res.status(201).json(coach);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ "error": "failure in signup." });
    }
  }
  return res.status(400).json({ msg: "User with the same phone number already exists" });
}

const httpPostCoachSignIn = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await Coach.findOne({ phoneNumber }, { __v: 0 });
    if (!user) {
      return res.status(404).send({ msg: "Unable to login, Invalid Credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).send({ msg: "Unable to login, Invalid Credentials." });
    }
    // TODO: OTP Verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    return res.send({ ...user._doc, token });
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
}

const httpCheckIfTokenIsValid = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json(false);
  try {
    const isVerified = jwt.verify(token, process.env.JWT_KEY);
    if (!isVerified) return res.status(400).json(false);
    const user = await Coach.findById(isVerified.id);
    if (!user) {
      return res.status(404).json(false);
    }
    return res.json(true);
  } catch (err) {
    return res.status(400).json(err);
  }
}

const httpGetUserData = async (req, res) => {
  const user = await Coach.findById(req.user);
  const userObject = user.toObject();
  delete userObject.password;
  return res.json({ ...userObject, token: req.token });
}

const httpUpdateUserData = async (req, res) => {
  const { firstName, lastName, trainingPlanPrice, dietPlanPrice } = req.body;
  // const buffer = await sharp(req.file.buffer).toBuffer();
  try {
    const existingUser = await Coach.findById(req.user);
    const user = new Coach({
      _id: req.user,
      phoneNumber: existingUser.phoneNumber,
      password: existingUser.password,
      firstName,
      lastName,
      trainingPlanPrice,
      dietPlanPrice,
    });
    await Coach.updateOne({ _id: req.user }, user);
    return res.status(204).json();
  } catch (e) {
    return res.status(400).json({ msg: "Error in updating profile." });
  }
}

const httpPostCoachSignOut = async (req, res) => {
  try {
    req.user = undefined;
    req.token = undefined;
    return res.status(204).json();
  } catch(e) {
    return res.status(400).json({msg: `Error in signing user out: ${e}`});
  }
}

const httpUpdateUserAvatar = async (req, res) => {
  const tempPath = req.file.path;
  const buffer = await sharp(tempPath).resize(500, 500).png().toBuffer();
  const multerFinalPath = path.join(__dirname, `../../${process.env.MULTER_FINAL_PATH}`);
  const multerSaveTo = `${multerFinalPath}/${req.user}.jpg`;

  const user = await Coach.findById(req.user);
  try {
    user.avatar = buffer;
    await user.save();
    fs.rename(tempPath, multerSaveTo, (err) => {
      if (err) throw err;
      fs.unlink(tempPath, () => {
        console.log("uploaded successfully");
        res.status(204);
      });
    });
    res.status(204);
  } catch (e) {
    return res.status(400).json({ "error": "Failure in updating avatar." });
  }
}

const httpGetMyAvatar = async (req, res) => {
  try {
    const user = await Coach.findById(req.params.id);

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: `Error in getting avatar: ${e}` });
  }
}

const httpDeleteMyAvatar = async (req, res) => {
  try {
    const multerFinalPath = path.join(__dirname, `../../${process.env.MULTER_FINAL_PATH}`);
    const multerTargetPath = `${multerFinalPath}/${req.user}.jpg`;

    const user = await Coach.findById(req.user);
    user.avatar = undefined;
    await user.save();
    fs.unlink(multerTargetPath, () => {
      console.log("Deleted");
      return res.status(204).json()
    });
  } catch (e) {
    return res.status(400).json({ msg: `Error in getting avatar: ${e}` });
  }
}

module.exports = {
  httpGetAllCoaches,
  httpPostCoachSignup,
  httpPostCoachSignIn,
  httpCheckIfTokenIsValid,
  httpGetUserData,
  httpUpdateUserData,
  httpPostCoachSignOut,
  httpUpdateUserAvatar,
  httpGetMyAvatar,
  httpDeleteMyAvatar,
}