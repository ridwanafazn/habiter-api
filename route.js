const express = require("express");
const {
  getAllTasks,
  updateProgress,
  deleteTask,
  createTask,
  getTasksByDate,
  getTaskById,
} = require("./controller");

const router = express.Router();

// GET all tasks for a specific user
router.get("/user/:userId/tasks", getAllTasks);

// GET all tasks for a specific user by current date or custom date
router.get("/user/:userId/task-today", getTasksByDate);

// GET a specific project for a specific user
router.get("/user/:userId/task/:id", getTaskById);

// POST a new task for a specific user
router.post("/user/:userId/task", createTask);

// PUT update progress for a task
router.put("/user/:userId/task/:id/update-progress", updateProgress);

// DELETE a task
router.delete("/user/:userId/task/:id", deleteTask);

module.exports = router;
