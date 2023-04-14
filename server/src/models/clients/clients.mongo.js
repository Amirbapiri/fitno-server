const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: "Password needs to have more than 6 characters.",
    }
  },
  location: {
    type: String,
  },
  major: {
    type: String,
  },
  avatar: {
    type: Buffer,
  }
});

clientSchema.pre("save", async function (req, res, next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;