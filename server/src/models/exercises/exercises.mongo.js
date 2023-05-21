const mongoose = require("mongoose");


const exercisesBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  muscle: { type: String, required: true },
});

exercisesBankSchema.index({ name: "text", type: "text", muscle: "text" })

exercisesBankSchema.statics.addBulkExercises = async function(exercises) {
  const existingExercises = await this.find({
    name: { $in: exercises.map((exercise) => exercise.name) },
  });

  const existingExerciseNames = existingExercises.map((exercise) => exercise.name);

  const newExercises = exercises.filter(
    exercise => !existingExerciseNames.includes(exercise.name)
  )

  if(newExercises.length > 0) {
    const addedExercises = await this.insertMany(newExercises);
    return addedExercises;
  }
  return [];
}

exercisesBankSchema.statics.searchExercises = async function(query) {
  try {
    const exercises = await this.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    return exercises;
  } catch (err) {
    throw new Error(`Failed to search exercises: ${err}`);
  }
}

const ExercisesBank = mongoose.model('ExercisesBank', exercisesBankSchema);

module.exports = ExercisesBank;
