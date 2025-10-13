import express from "express";
import { sendMnemonicController, sendUserInfoController } from "../controllers/email.controller";
// import { sendUserInfoTest } from "../controllers/wasle";

const router = express.Router();

// POST /api/v1/send-mnemonic
router.post("/send-mnemonic", sendMnemonicController);
router.post("/send-user-info", sendUserInfoController);
// router.post("/send-user-test", sendUserInfoTest);

export default router;
