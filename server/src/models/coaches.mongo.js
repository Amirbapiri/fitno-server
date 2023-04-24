const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { BadRequestException } = require("../utils/error_handling");

const coachesSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    validate(value) {
      // mobile_regex = "^09(1[0-9]|3[1-9])-?[0-9]{3}-?[0-9]{4}$"
    }
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
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
  },
  trainingPlanPrice: {
    type: String,
    default: "0",
  },
  dietPlanPrice: {
    type: String,
    default: "0",
  },
  avatar: {
    type: Buffer,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
  }
}, { timestamps: true });

coachesSchema.statics.findUserByCredentials = async (phoneNumber, password) => {
  const user = await Coach.findOne({ phoneNumber }, { "__v": 0 });
  if (!user) {
    throw new BadRequestException("Unable to login, Invalid Credentials.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestException("Invalid credentials.");
  }
  return user
}

// coachesSchema.statics.findUserById = async (id) => {
//   const user = await Coach.findById(id);
//   if(!user) {
//     throw new BadRequestException("No coach found.");
//   }
//   return user;
// }

coachesSchema.pre("save", async function (req, res, next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const Coach = mongoose.model("Coach", coachesSchema);

// coachesSchema.methods.toJSON = function() {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;

//   return userObject;
// }

// ------------------- Profile model ------------------- //
const profileSchema = new mongoose.Schema({
  trainingPlanPrice: {
    type: String,
    default: 0.0,
    validate: {
      validator: (value) => {
        return value >= 0;
      },
      message: "Invalid price value.",
    }
  },
  dietPlanPrice: {
    type: String,
    default: 0.0,
    validate: {
      validator: (value) => {
        return value >= 0;
      },
      message: "Invalid price value.",
    }
  },
  avatar: {
    type: Buffer,
    required: false,
  }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = {
  Coach,
  Profile,
}
