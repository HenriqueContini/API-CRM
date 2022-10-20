import express from "express";
import CRMController from "../controllers/CRMController.js";

const router = express.Router();

router
    .post('/crm/create-crm', CRMController.createCRM)
    .get('/crm/usercrm/:user', CRMController.usercrm)

export default router;