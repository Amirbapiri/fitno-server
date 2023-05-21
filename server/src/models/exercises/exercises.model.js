const Exercise = require("./exercises.mongo");

async function getAllExericses() {
  try {
    return await Exercise.find({}, {__v: 0});
  } catch (e) {
    throw new Error(`Error in getting exercises: ${e}`);
  }
}


module.exports = {
  getAllExericses,
}
