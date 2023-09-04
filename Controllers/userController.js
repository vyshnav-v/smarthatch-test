import Task from "../Models/taskModel.js";
import User from "../Models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = new User({ username: username });
    const newUser = await user.save();
    return res
      .status(201)
      .json({ message: "user created successfully", newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserTask = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({
      $or: [{ user: userId }, { "assignedTo.assignee": userId }],
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, userId, assignedToUserId } = req.body;

    const task = new Task({
      title,
      user: userId,
      assignedTo: [{ assignee: assignedToUserId }],
    });

    const newTask = await task.save();

    return res
      .status(201)
      .json({ message: "Task created successfully", newTask });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};
export const reassignTask = async (req, res) => {
  try {
    const { taskId, newAssigneeUserId } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.assignedTo.push({ assignee: newAssigneeUserId });
    await task.save();

    return res
      .status(200)
      .json({ message: "Task reassigned successfully", task });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};
