import { Router } from "express";
import { documentController } from "../controllers/documents";

const router: Router = Router();

// Document Endpoints
router.post("/documents", documentController.createDocument);
//router.get("/documents/:id", documentController.getDocumentById);
router.get("/user", documentController.getDocumentsByUser);
router.put("/documents/:id", documentController.updateDocument);
router.delete("/documents/:id", documentController.deleteDocument);

// Signature Endpoints
router.post("/signatures", documentController.createSignature);
router.put("/signatures/:id/sign", documentController.signDocument);

export default router;
