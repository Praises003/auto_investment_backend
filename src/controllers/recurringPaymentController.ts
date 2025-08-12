import { Request, Response } from "express";
import { setRecurringPayment, getRecurringPayment } from "../services/recurringPaymentService";

export const setRecurringPaymentController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = req.body;

    const updated = await setRecurringPayment(userId, data);
    res.status(200).json({ message: "Recurring payment set", data: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getRecurringPaymentController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await getRecurringPayment(userId);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
