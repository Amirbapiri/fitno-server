const mongoose = require("mongoose");


const requestsSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
  },
  height: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Height value is not correct."
    }
  },
  weight: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Weight value is not correct."
    }
  },
  chest: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Chest value is not correct."
    }
  },
  biceps: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Biceps value is not correct."
    }
  },
  forearm: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Forearm value is not correct."
    }
  },
  waist: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Waist value is not correct."
    }
  },
  hips: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Hips value is not correct."
    }
  },
  leg: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        // We only restrict negative values.
        return value >= 0;
      },
      message: "Leg value is not correct."
    }
  },
  extraDescription: {
    type: String,
  },
  // totalPrice: {
    
  // }
}, { timestamps: true });

requestsSchema.pre("save", function () {
  const request = this;
  // generate random code
  const currentDateCode = Date.now().toString().split("").reverse().join("").slice(0, 6);
  const randomInteger = Math.floor((Math.random() * 999999) + 1).toString();
  request.code = currentDateCode + randomInteger;
  return request;
});

const Request = mongoose.model("Request", requestsSchema);

module.exports = Request;
