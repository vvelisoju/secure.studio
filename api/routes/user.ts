import { Router } from "express";
import { userController } from "../controllers/user";

const router = Router();

router.get("/", userController.getUser);
router.get("/all", userController.getAllUsers);

router.post("/", userController.createUserByAdmin);
router.post("/employee", userController.createEmployeeByCompanyAdmin);
router.post("/upload-profile", userController.uploadProfilePic);

router.post("/subscription-status-single", userController.sendSubscriptionStatusMailToUser);
router.post("/subscription-status-multiple", userController.sendSubscriptionStatusMailToUsers);

router.put("/", userController.updateUser);
router.put("/status", userController.updateUserStatus);

router.put("/delete-profile", userController.deleteProfilePic);
router.put("/replace-profile", userController.replaceProfilePic);

router.put("/delete-user", userController.deleteUser);
router.put("/delete-users", userController.deleteUsers);

export default router;
