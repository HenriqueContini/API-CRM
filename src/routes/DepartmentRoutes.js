import express from "express";
import DepartmentController from "../controllers/DepartmentController.js";

const router = express.Router();

router
    .get('/department/list-departments/:userdepartment', DepartmentController.listDepartments)

export default router;