const express = require("express");
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.route("/").get(getTasks).post(createTask);

// "/stats" must be declared before "/:id", otherwise Express treats "stats" as an id
router.get("/stats", getTaskStats);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
