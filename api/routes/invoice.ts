import { Router } from "express";
import { invoiceController } from "../controllers/invoice";

const router = Router();

router.get("/", invoiceController.getInvoicesOfUser);
router.get("/user", invoiceController.getAllInvoicesOfUser);
router.put("/user", invoiceController.updateInvoicesOfUser);

export default router;
