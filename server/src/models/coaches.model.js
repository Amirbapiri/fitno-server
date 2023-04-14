const { Coach } = require("./coaches.mongo");

async function getAllCoaches() {
  try {
    return await Coach.find({}, {__v: 0});
  } catch (e) {
    throw new Error(`Error in getting coaches: ${e}`);
  }
}

async function getCoachByPhoneNumber(phoneNumber) {
  try {
    return await Coach.findOne({ phoneNumber });
  } catch (e) {
    throw new Error(`No user exists with the given phone number: ${e}`);
  }
}

module.exports = {
  getAllCoaches,
  getCoachByPhoneNumber,
}