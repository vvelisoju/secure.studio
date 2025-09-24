import { Router } from "express";
import { subscriptionController } from "../controllers/subscription";

const router = Router();

router.put("/adminAllowed", subscriptionController.updateAdminAllowed);
router.put("/activate", subscriptionController.activateQuotedSubscription);

router.put("/", subscriptionController.updateSubscriptionOfUser);

router.delete("/", subscriptionController.deleteSubscription);


export default router;
