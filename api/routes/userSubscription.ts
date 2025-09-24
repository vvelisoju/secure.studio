import { Router } from "express";
import { userSubscriptionController } from "../controllers/userSubscription";

const router = Router();

router.get("/", userSubscriptionController.getAllSubscriptionsOfuser);
router.get("/all/assignedBy", userSubscriptionController.getAllUsersofAssignedByCompanyAdmin);


export default router;