import express from "express";
import { createTask, createUser, getUserTask, reassignTask } from "../Controllers/userController.js";


const router = express.Router();


router.post("/new-user", createUser);

router.get("/get-task/:userId", getUserTask);
router.post('/create-task', createTask);
router.post("/reassign-task", reassignTask);






export default router;