import express from "express";
import multer from "multer";
import CRMController from "../controllers/CRMController.js";
import FileService from "../services/FileService.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});

router
    .post('/crm/create-crm', upload.array('files'), FileService.addFilesCRM, CRMController.createCRM)
    .get('/crm/usercrms/:user', CRMController.getUserCRMs)
    .get('/crm/awarecrms/:user', CRMController.getAwareCRMs)
    .get('/crm/getcrm/:id', CRMController.getCRM)
    .post('/crm/editcrm/:id', CRMController.editCRM)

export default router;