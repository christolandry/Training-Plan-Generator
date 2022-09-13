const mongoose = require("mongoose");

const Workouts = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  units: {
    type: String,
    required: true,
  },
  text: { 
    type: String,
    required: true,
  },
  plan_type: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Workouts", Workouts);
