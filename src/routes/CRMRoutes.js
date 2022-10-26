import express from "express";
import CRMController from "../controllers/CRMController.js";

const router = express.Router();

router
    .post('/crm/create-crm', CRMController.createCRM)
    .get('/crm/usercrms/:user', CRMController.userCRMs)
    .get('/crm/awarecrms/:user', CRMController.awareCRMs)

export default router;