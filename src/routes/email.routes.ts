import express from "express";
import { sendMnemonicController, sendUserInfoController } from "../controllers/email.controller";

const router = express.Router();

// POST /api/v1/send-mnemonic
router.post("/send-mnemonic", sendMnemonicController);
router.post("/send-user-info", sendUserInfoController);

export default router;
