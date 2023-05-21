const express = require("express");
const { httpGetAllExercises, httpPostNewExercise, httpPostNewExerciseBulk, httpPostSearchExercises } = require("./exercises.controller");

exercises_router = express.Router()


exercises_router.get("", httpGetAllExercises);
exercises_router.post("/add", httpPostNewExercise);
exercises_router.post("/add/bulk", httpPostNewExerciseBulk);
exercises_router.get("/search", httpPostSearchExercises);


module.exports = exercises_router;
