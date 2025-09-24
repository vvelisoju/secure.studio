import { Request, Response } from "express";
import upload from "../utils/multer";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { s3Service } from "../services/upload";


class S3Controller {

    async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            // Multer uploads single file with field name "file"
            upload.single("file")(req, res, async (err) => {
                if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
                let fileUrl;
                if (req.file) {
                    const file = req.file;
                    const type = req?.body?.type || "Public"
                    const bucketParamKey = `${process.env.APP_NAME?.replace(" ","-")}/${type}/${file.filename}`;
                    const filePath = file.path;
                    const contentType = file.mimetype;
                    fileUrl = await s3Service.uploadFile(bucketParamKey, filePath, contentType);
                }
                successResponse(res, "File uploaded successfully", { url: fileUrl });
            });
        } catch (error: any) {
            errorResponse(error, res);
        }
    }

    async replaceFile(req: Request, res: Response): Promise<void> {
        try {
            // Multer uploads single file with field name "file"
            upload.single("file")(req, res, async (err) => {
                if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
                let fileUrl;
                if (req.file) {
                    const file = req.file;
                    const previousFileUrl = req.body.url;
                    const filePath = file.path;
                    const contentType = file.mimetype;
                    fileUrl = await s3Service.replaceFile(previousFileUrl, filePath, contentType);
                }
                successResponse(res, "File replaced successfully", { url: fileUrl });
            });
        } catch (error: any) {
            errorResponse(error, res);
        }
    }

    async deleteFile(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await s3Service.deleteFile(req.body.url);
            successResponse(res, "File Deleted successfully", { url: deleted });
        } catch (error: any) {
            errorResponse(error, res);
        }
    }
}

export const s3Controller = new S3Controller();
