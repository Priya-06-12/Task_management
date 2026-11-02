const mongoose = require("mongoose");
const Task = require("../models/Task");
const { STATUSES } = require("../models/Task");

// Helper: only allow the fields we expect from the client
const pickTaskFields = (body = {}) => {
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) data.status = body.status;
  return data;
};

// Helper: escape special regex characters so searches like "c++" don't break
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sendNotFound = (res) =>
  res.status(404).json({ success: false, message: "Task not found" });

const sendInvalidId = (res) =>
  res.status(400).json({ success: false, message: "Invalid task id" });

// @desc    Get all tasks (optional ?status= and ?search= filters)
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status filter" });
      }
      filter.status = status;
    }

    if (typeof search === "string" && search.trim()) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task counts per status
// @route   GET /api/tasks/stats
const getTaskStats = async (req, res, next) => {
  try {
    const grouped = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = { total: 0, pending: 0, inProgress: 0, completed: 0 };
    grouped.forEach(({ _id, count }) => {
      stats.total += count;
      if (_id === "Pending") stats.pending = count;
      if (_id === "In Progress") stats.inProgress = count;
      if (_id === "Completed") stats.completed = count;
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendInvalidId(res);

    const task = await Task.findById(req.params.id);
    if (!task) return sendNotFound(res);

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(pickTaskFields(req.body));
    res.status(201).json({ success: true, message: "Task created", data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendInvalidId(res);

    const task = await Task.findByIdAndUpdate(req.params.id, pickTaskFields(req.body), {
      new: true, // return the updated document
      runValidators: true, // apply schema validation on updates too
    });
    if (!task) return sendNotFound(res);

    res.json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendInvalidId(res);

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return sendNotFound(res);

    res.json({ success: true, message: "Task deleted", data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
