import { Router } from "express";
import { s3Controller } from "../controllers/s3";

const router = Router();

router.post("/upload-file", s3Controller.uploadFile);
router.post("/replace-file", s3Controller.replaceFile);
router.post("/delete-file", s3Controller.deleteFile);

export default router;
