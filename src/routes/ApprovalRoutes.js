import express from "express";
import ApprovalController from "../controllers/ApprovalController.js";

const router = express.Router();

router
    .put('/approval/putdecision/:crm', ApprovalController.putDecision)

export default router;