const mongoose = require("mongoose");

const TrainingPlan = new mongoose.Schema({
  distance: {
    type: Number,
    required: true,
  },
  weeklySchedule: {
    type: Array,
    required: true,
  },
  weeklyTotals: {
    type: Array,
    required: true,
  },
  mileage: { 
    type: Array,
    required: true,
  },
  startingDate: {
    type: Date,
    required: false,
  },
  userId: { //New
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TrainingPlan", TrainingPlan);
