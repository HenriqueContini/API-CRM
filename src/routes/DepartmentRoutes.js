import express from "express";
import DepartmentController from "../controllers/DepartmentController.js";

const router = express.Router();

router
    .get('/department/list-departments/:userdepartment', DepartmentController.getDepartments)
    .get('/department/list-all-departments', DepartmentController.getAllDepartments)

export default router;