import express from "express";
import { sendMnemonicController } from "../controllers/email.controller";

const router = express.Router();

// POST /api/v1/send-mnemonic
router.post("/send-mnemonic", sendMnemonicController);

export default router;
