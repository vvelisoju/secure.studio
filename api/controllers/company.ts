import { Request, Response } from "express";
import { companyService } from "../services/company";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { validateUpdateCompany } from "../validators/company";
import { s3Service } from "../services/upload";
import upload from "../utils/multer";

class CompanyController {
    async updateCompany(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = await validateUpdateCompany(req.body);
            const company = await companyService.updateCompany(validatedData);
            successResponse(res, "Company details updated successfully", company);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async getAdminCompanyDetails(req: Request, res: Response): Promise<void> {
        try {
            const company = await companyService.getCompany("1f13a4d0-b848-4a77-86b2-195df1283f9d");
            successResponse(res, "Company details fetched successfully", company);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async deleteLogo(req: Request, res: Response): Promise<void> {
        try {
            await s3Service.deleteFile(req.body.url);
            const data = { id: "1f13a4d0-b848-4a77-86b2-195df1283f9d", logoUrl: "" };
            const user = await companyService.updateCompany(data);
            successResponse(res, "Logo deleted successfully", user);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
    async uploadLogo(req: Request, res: Response): Promise<void> {
        try {

            let fileUrl;
            // Multer uploads single file with field name "file"
            upload.single("file")(req, res, async (err) => {
                if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
                if (req.file) {
                    const file = req.file;
                    const bucketParamKey = `${process.env.APP_NAME?.replace(" ", "-")}/company/1f13a4d0-b848-4a77-86b2-195df1283f9d/logo/${file.filename}`;
                    const filePath = file.path;
                    const contentType = file.mimetype;
                    fileUrl = await s3Service.uploadFile(bucketParamKey, filePath, contentType);
                    const data = { id: "1f13a4d0-b848-4a77-86b2-195df1283f9d", logoUrl: fileUrl };
                    const user = await companyService.updateCompany(data);
                    successResponse(res, "Logo uploaded successfully", user);
                }
            });
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
    async replaceLogo(req: Request, res: Response): Promise<void> {
        try {
            let fileUrl;
            // Multer uploads single file with field name "file"
            upload.single("file")(req, res, async (err) => {
                if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
                if (req.file) {
                    const file = req.file;
                    const previousFileUrl = req.body.url;
                    const filePath = file.path;
                    const contentType = file.mimetype;
                    fileUrl = await s3Service.replaceFile(previousFileUrl, filePath, contentType);
                    const data = {id: "1f13a4d0-b848-4a77-86b2-195df1283f9d", logoUrl: (fileUrl + '?t=' + new Date().getTime()) };
                    const user = await companyService.updateCompany(data);
                    successResponse(res, "Logo updated successfully", user);
                }
            });

        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const companyController = new CompanyController();
