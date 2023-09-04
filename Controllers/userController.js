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

// const generateNextTaskName = async (parentTaskId) => {
//   let baseName = "T";

//   if (parentTaskId) {
//     const parentTask = await Task.findById(parentTaskId);
//     if (parentTask) {
//       baseName = parentTask.taskName;
//     }
//   }

//   const maxTaskNumber = await Task.findOne({ parentTask: parentTaskId })
//     .sort({ taskName: -1 })
//     .limit(1);
//     let nextTaskNumber = 1;
//     if (maxTaskNumber && maxTaskNumber.taskName.startsWith(baseName)) {
//       const lastTaskNumber = parseInt(maxTaskNumber.taskName.split("-")[2], 10);
//       console.log(lastTaskNumber);
//     nextTaskNumber = lastTaskNumber + 1;
//   }

//   return `${baseName}-${nextTaskNumber}`;
// };
const generateNextTaskName = async (parentTaskId) => {
  let baseName = "T";

  if (parentTaskId) {
    const parentTask = await Task.findById(parentTaskId);
    if (parentTask) {
      baseName = parentTask.taskName;
    }
  }

  const maxTaskNumber = await Task.findOne({ parentTask: parentTaskId })
    .sort({ taskName: -1 })
    .limit(1);

  let nextTaskNumber = 1;
  if (maxTaskNumber && maxTaskNumber.taskName.startsWith(baseName)) {
    const lastTaskNumber = parseInt(maxTaskNumber.taskName.split("-")[2], 10);
    if (!isNaN(lastTaskNumber)) {
      nextTaskNumber = lastTaskNumber + 1;
    }
  }

  return `${baseName}-${nextTaskNumber}`;
};

export const createTask = async (req, res) => {
  try {
    const { title, userId, assignedToUserId } = req.body;

    const taskName = await generateNextTaskName(null);

    const task = new Task({
      title,
      user: userId,
      assignedTo: [{ assignee: assignedToUserId }],
      taskName,
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

export const createSubtask = async (req, res) => {
  try {
    const { title, userId, parentTaskId, assignedToUserId } = req.body;

    const taskName = await generateNextTaskName(parentTaskId);

    const task = new Task({
      title,
      user: userId,
      parentTask: parentTaskId,
      assignedTo: [{ assignee: assignedToUserId }],
      taskName,
    });

    const newTask = await task.save();

    return res
      .status(201)
      .json({ message: "Subtask created successfully", newTask });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

export const reassignTask = async (req, res) => {
  try {
    const { taskId, newAssigneeUserId, userId } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.assignedTo.some(
        (assignee) => assignee.assignee.toString() === userId
      )
    ) {
      const taskName = await generateNextTaskName(task.parentTask);

      const reassignmentTask = new Task({
        title: task.title,
        user: userId,
        parentTask: task.parentTask,
        taskName,
      });

      reassignmentTask.assignedTo.push({ assignee: newAssigneeUserId });

      const reassign = await reassignmentTask.save();

      return res
        .status(200)
        .json({ message: "Task reassigned successfully", reassign });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to reassign this task" });
    }
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};
