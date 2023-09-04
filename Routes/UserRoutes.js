import express from "express";
import {
  createTask,
  createUser,
  getUserTask,
  reassignTask,
  createSubtask,
} from "../Controllers/userController.js";


const router = express.Router();


router.post("/new-user", createUser);

router.get("/get-task/:userId", getUserTask);
router.post('/create-task', createTask);
router.post("/reassign-task", reassignTask);
router.post("/create-sub-task", createSubtask);






export default router;