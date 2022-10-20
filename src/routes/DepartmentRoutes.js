import express from "express";
import DepartmentController from "../controllers/DepartmentController.js";

const router = express.Router();

router
    .get('/Department/listDeparments', DepartmentController.listDepartments)

export default router;