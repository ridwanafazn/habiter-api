const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  repeatDay: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
  customColor: { type: String },
  progress: {
    date: { type: Date },
    totalDone: { type: Number },
    totalTask: { type: Number },
    dailyProgress: { type: String, default: "none" },
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
