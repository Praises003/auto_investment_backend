import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  setRecurringPaymentController,
  getRecurringPaymentController
} from "../controllers/recurringPaymentController";

const router = express.Router();

router.post("/set", authMiddleware, setRecurringPaymentController);
router.get("/get", authMiddleware, getRecurringPaymentController);

export default router;
    