const path = require("path");
const fs = require("fs");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");

const Client = require("../../models/clients/clients.mongo")
const { getClientByPhoneNumber } = require("./../../models/clients/clients.model");

const httpPostClientSignUp = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const existingUser = await getClientByPhoneNumber(phoneNumber);
  if (!existingUser) {
    try {
      const client = await new Client({
        phoneNumber,
        password,
      }).save();
      return res.status(201).json(client);
    } catch (e) {
      return res.status(400).json({ "error": "Failure in signup." });
    }
  }
  return res.status(400).json({ msg: "User with the same phone number already exists." });
}

const httpPostClientSignIn = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await Client.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).send({ msg: "Unable to login, Invalid Credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).send({ msg: "Unable to login, Invalid Credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    const userObject = user.toObject();
    delete userObject.avatar;

    return res.send({ ...userObject, token });
  } catch (e) {
    return res.status(404).json(e);
  }
}

const httpCheckIfTokenIsValid = async (req, res) => {
  // const { token } = req.body;
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).json(false);
  try {
    const isVerified = jwt.verify(token, process.env.JWT_KEY);
    if (!isVerified) return res.status(400).json(false);
    const user = await Client.findById(isVerified.id);
    if (!user) {
      return res.status(404).json(false);
    }
    return res.json(true);
  } catch (err) {
    return res.status(400).json(err);
  }
}

const httpGetUserData = async (req, res) => {
  try {
    const user = await Client.findById(req.user);
    return res.json({ ...user._doc, token: req.token });
  } catch (err) {
    return res.status(400).json(err);
  }
}

const httpUpdateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, major } = req.body;
    const existingUser = await Client.findById(req.user);
    const user = new Client({
      _id: req.user,
      phoneNumber: existingUser.phoneNumber,
      password: existingUser.password,
      firstName: firstName,
      lastName: lastName,
      gender: existingUser.gender,
      major: major,
    });

    await Client.updateOne({ _id: req.user }, user);
    return res.status(204).json();
  } catch (err) {
    return res.status(400).json(err);
  }
}

const httpUpdateUserAvatar = async (req, res) => {
  const tempPath = req.file.path;
  const buffer = await sharp(tempPath).resize(500, 500).png().toBuffer();
  const multerFinalPath = path.join(__dirname, `../../${process.env.MULTER_FINAL_PATH}`);
  const multerSaveTo = `${multerFinalPath}/${req.user}.jpg`;

  const user = await Client.findById(req.user);

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
    const user = await Client.findById(req.params.id);

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

    const user = await Client.findById(req.user);
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

const httpPostClientSignOut = async (req, res) => {
  try {
    req.user = undefined;
    req.token = undefined;
    return res.status(204).json();
  } catch(e) {
    return res.status(400).json({msg: `Error in signing user out: ${e}`});
  }
}

module.exports = {
  httpPostClientSignUp,
  httpPostClientSignIn,
  httpCheckIfTokenIsValid,
  httpGetUserData,
  httpUpdateUserProfile,
  httpUpdateUserAvatar,
  httpGetMyAvatar,
  httpDeleteMyAvatar,
  httpPostClientSignOut,
}