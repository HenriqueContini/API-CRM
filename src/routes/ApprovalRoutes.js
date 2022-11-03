import express from "express";
import ApprovalController from "../controllers/ApprovalController.js";

const router = express.Router();

router
    .put('/approval/putdecision/:crm', ApprovalController.putDecision)
    .put('/approval/putitdecision/:crm', ApprovalController.putITDecision)

export default router;