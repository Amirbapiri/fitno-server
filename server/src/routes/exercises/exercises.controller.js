const { getAllExericses } = require("../../models/exercises/exercises.model");
const ExercisesBank = require("./../../models/exercises/exercises.mongo");

const httpGetAllExercises = async (req, res) => {
  try{
    const exercises = await getAllExericses();
    res.json(exercises);
  } catch(e) {
    return res.status(400).json({message: e});
  }
}

const httpPostNewExercise = async (req, res) => {
  try {
    const exercise = new ExercisesBank(req.body);
    await exercise.save();
    res.status(201).json(exercise);
  } catch(e) {
    res.status(400).json({message: e.message});
  }
}

const httpPostNewExerciseBulk = async (req, res) => {
  try {
    ExercisesBank.addBulkExercises(req.body)
      .then((addedExercises) => {
        res.json(addedExercises);
      })
      .catch(e => res.status(500).json({message: e.message}));
  } catch (e) {
    res.status(400).json({message: e.message});
  }
}

const httpPostSearchExercises = async (req, res) => {
  const { query } = req.query;
  try{
    const exercises = await ExercisesBank.searchExercises(query);
    res.json(exercises);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
}

module.exports = {
  httpGetAllExercises,
  httpPostNewExercise,
  httpPostNewExerciseBulk,
  httpPostSearchExercises,
}
