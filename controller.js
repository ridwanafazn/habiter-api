const Task = require("./model.js");

// GET all tasks for a specific user
exports.getAllTasks = async (req, res) => {
  const userId = req.params.userId;

  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

// GET a specific task for a specific user
exports.getTaskById = async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found for the specified user" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET tasks for a specific user based on date (current date or custom date)
exports.getTasksByDate = async (req, res) => {
  const userId = req.params.userId;
  const currentDate = new Date();
  const customDate = req.query.date ? new Date(req.query.date) : null;

  try {
    const query = {
      userId,
      "progress.date": {},
    };

    if (customDate) {
      query["progress.date"] = {
        $gte: customDate,
        $lt: new Date(customDate.getTime() + 24 * 60 * 60 * 1000),
      };
    } else {
      query["progress.date"] = {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        ),
      };
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new task for a specific user
exports.createTask = async (req, res) => {
  const userId = req.params.userId;
  const { title, startDate, repeatDay, type, endDate } = req.body;

  if (!userId || !title || !type) {
    return res
      .status(400)
      .json({ message: "UserId, type and title are required" });
  }

  const task = new Task({
    userId,
    title,
    type,
    startDate,
    endDate,
    repeatDay,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message, body: req.body });
  }
};

// PUT update progress for a task
exports.updateProgress = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found for the specified user" });
    }

    // Update progress fields if provided
    if (req.body.date) task.progress.date = req.body.date;
    if (req.body.totalDone) {
      // Jika totalDone sebelumnya null, ganti dengan 0
      task.progress.totalDone = task.progress.totalDone || 0;
      task.progress.totalDone += req.body.totalDone;

      // Set dailyProgress based on conditions
      if (
        task.progress.totalDone > 0 &&
        task.progress.totalDone < task.progress.totalTask
      ) {
        task.progress.dailyProgress = "ongoing";
      } else if (task.progress.totalDone === task.progress.totalTask) {
        task.progress.dailyProgress = "done";
      } else {
        task.progress.dailyProgress = "none";
      }
    }
    if (req.body.totalTask) task.progress.totalTask = req.body.totalTask;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found for the specified user" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
