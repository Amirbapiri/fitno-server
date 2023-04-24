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

coachesSchema.statics.updateCoach = async function(coachId, updateData) {
  const existingCoach = await this.findById(coachId);
  if(!existingCoach) {
    throw new Error("Coach not found");
  }

  const coach = new this({
    _id: coachId,
    phoneNumber: existingCoach.phoneNumber,
    password: existingCoach.password,
    firstName: updateData.firstName || existingCoach.firstName,
    lastName: updateData.lastName || existingCoach.lastName,
    trainingPlanPrice: updateData.trainingPlanPrice || existingCoach.trainingPlanPrice,
    dietPlanPrice: updateData.dietPlanPrice || existingCoach.dietPlanPrice,
  });

  await this.updateOne({ _id: coachId }, coach);
  return this.findById(coachId);
}

coachesSchema.pre("save", async function (req, res, next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const Coach = mongoose.model("Coach", coachesSchema);


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
