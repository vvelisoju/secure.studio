import { Request, Response } from "express";
import { documentService } from "../services/documents";

export const documentController = {
  async createDocument(req: Request, res: Response) {
    try {
      const document = await documentService.createDocument(req.body);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to create document" });
    }
  },

  async getDocumentById(req: Request, res: Response) {
    try {
      const document = await documentService.getDocumentById(req.params.id);
      if (!document) return res.status(404).json({ error: "Document not found" });
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  },

  async getDocumentsByUser(req: Request, res: Response) {
    try {
      const userId = req.query?.id as string || req.user?.id as string;
      const documents = await documentService.getDocumentsByUser(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  },

  async updateDocument(req: Request, res: Response) {
    try {
      const updatedDocument = await documentService.updateDocument(req.params.id, req.body);
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ error: "Failed to update document" });
    }
  },

  async deleteDocument(req: Request, res: Response) {
    try {
      await documentService.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  },

  async createSignature(req: Request, res: Response) {
    try {
      const signature = await documentService.createSignature(req.body);
      res.status(201).json(signature);
    } catch (error) {
      res.status(500).json({ error: "Failed to create signature" });
    }
  },

  async signDocument(req: Request, res: Response) {
    try {
      const signedSignature = await documentService.signDocument(req.params.id, req.body);
      res.json(signedSignature);
    } catch (error) {
      res.status(500).json({ error: "Failed to sign document" });
    }
  },
};
