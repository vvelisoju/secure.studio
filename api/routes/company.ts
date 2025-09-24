import { Router } from "express";
import { companyController } from "../controllers/company";

const router = Router();


router.post("/upload-logo", companyController.uploadLogo);


router.get("/admin", companyController.getAdminCompanyDetails);

router.put("/", companyController.updateCompany);
router.put("/delete-logo", companyController.deleteLogo);
router.put("/replace-logo", companyController.replaceLogo);

export default router;
