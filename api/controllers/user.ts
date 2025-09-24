import { Request, Response } from "express";
import { userMiscService, userService } from "../services/user";
import { validateEmployeeDetails, validateUserUpdateBody, validateUserCreationByAdmin, validateUserStatusBody } from "../validators/user";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { s3Service } from "../services/upload";
import upload from "../utils/multer";
import { companyService } from "../services/company";
import { NotificationChannel, Prisma, SubscriptionStatus } from "@prisma/client";
import { separateUserAndCompanyDetails } from "../utils/misc"
import { validateCreateCompany } from "../validators/company";
import { userSubscriptionService } from "../services/userSubscription";
import { subscriptionMiscService } from "../services/subscription";
import { notificationService } from "../services/notification";
import { convertDatePrimaryStyle, convertTimePrimaryStyle } from "../utils/date";
import { DateTime } from "luxon";
import path from "path";
import fs from "fs"
class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      // Pages related
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Dates to bring <= 3 days subscriptions that are going to expire.
      const isDashboardPage = req.query.section === "DASHBOARD";
      let dates = {};
      if (isDashboardPage) {
        dates = {
          now: DateTime.now().startOf("day").toJSDate(),
          threeDaysLater: DateTime.now().plus({ days: 3 }).endOf("day").toJSDate()
        }
      }

      const search = req?.query?.search as string || undefined;

      // userTypes can be [] of USER , USER_ADMIN , EMPLOYEE
      let userTypes: any = req.query.userType;
      userTypes = userTypes.length > 0 ? userTypes.split(",") : undefined

      // Bring users with no subscriptions
      let bringTrailUsers = JSON.parse(req.query.bringTrailUsers as string);

      // invoiceType user or non-invoiceType user ?
      let invoiceTypes: any = req.query.invoiceType;
      invoiceTypes = invoiceTypes.length > 0 ? invoiceTypes.split(",") : undefined
      if (invoiceTypes && invoiceTypes.length > 0) {
        if (invoiceTypes.includes("INVOICE")) {
          invoiceTypes = false
        } else if (invoiceTypes.includes("TAX_INVOICE")) {
          invoiceTypes = true
        }
      }

      // user status [] of ACTIVE , INACTIVE
      let userStatus: any = req.query.userStatus;
      userStatus = userStatus.length > 0 ? userStatus.split(",") : undefined

      // user status [] of ACTIVE , INACTIVE
      let subscriptionStatus: any = req.query.subscriptionStatus;
      subscriptionStatus = subscriptionStatus?.length > 0 ? subscriptionStatus.split(",") : bringTrailUsers ? ["DELETED", "QUOTED"] : ["ACTIVE", "INACTIVE", "DELETED", "QUOTED"]

      if ((req.query.subscriptionStatus as string).length === 0 && !bringTrailUsers) {
        bringTrailUsers = true
      }


      const joiningFrom = req.query.joiningFrom as string || undefined;
      const joiningTo = req.query.joiningTo as string || undefined;

      const users = await userService.getAllUsers(page, limit, search, userTypes, userStatus, subscriptionStatus, joiningFrom, joiningTo, bringTrailUsers, invoiceTypes, dates);
      successResponse(res, "Users fetched successfully", users);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const user: any = await userMiscService.getUserCompany(req?.user?.id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await userMiscService.getAllEmployeesByCompanyId(page, limit, user?.company?.id);
      successResponse(res, "Employees fetched successfully", users);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async createUserByAdmin(req: Request, res: Response): Promise<void> {
    try {
      const userType = req.body.userType;
      const { company, user: userData } = separateUserAndCompanyDetails(req.body);
      const validatedData = await validateUserCreationByAdmin(userData);
      let user;

      if (userType === "USER_ADMIN") {
        const companyData = await validateCreateCompany(company);
        const newCompany = await companyService.createCompany(companyData);
        const userData = { ...validatedData, companyId: newCompany.id };
        user = await userService.createUser(userData);
      } else if (userType === "USER") {
        user = await userService.createUser(validatedData);
      }

      if (user) {
        // create notification record
        const notificationData: Prisma.NotificationUncheckedCreateInput = {
          userId: user.id,
          placeHolders: {
            name: user?.name,
            username: user?.name,
            email: user?.email,
            accountType: user?.userType === "USER_ADMIN" ? "COMPANY" : "INDIVIDUAL",
            registrationDate: convertDatePrimaryStyle(user?.createdAt),
            registrationTime: convertTimePrimaryStyle(user?.createdAt)
          },
          templateName: "registeredUser",
        };
        await notificationService.createNotification(notificationData);
      }

      successResponse(res, "User created successfully");
    } catch (error: any) {
      errorResponse(error, res);
    }
  }

  async createEmployeeByCompanyAdmin(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validateEmployeeDetails(req.body);
      const subscriptionId = validatedData.subscriptionId;
      delete validatedData.subscriptionId;

      // get company admin company id and assign same to employee.
      const userDetails: any = userMiscService.getUserCompany(req?.user?.id);

      // create employee(user).
      const userData = { ...validatedData, companyId: userDetails?.company?.id } as Prisma.UserUncheckedCreateInput;
      const user = await userService.createUser(userData);

      // create notification record
      const notificationData: Prisma.NotificationUncheckedCreateInput = {
        userId: user.id,
        placeHolders: {
          name: user?.name,
          username: user?.name,
          email: user?.email,
          accountType: user?.userType === "USER_ADMIN" ? "COMPANY" : "INDIVIDUAL",
          registrationDate: convertDatePrimaryStyle(user?.createdAt),
          registrationTime: convertTimePrimaryStyle(user?.createdAt)
        },
        templateName: "registeredUser",
      };
      await notificationService.createNotification(notificationData);

      // assign the selected subscription to employee.
      await userSubscriptionService.createUserSubscription({ userId: user?.id, subscriptionId, assignedBy: req?.user?.id });

      // increase the employees filled column for the selected subscription.
      await subscriptionMiscService.increaseSubscriptionEmployeesFilled(subscriptionId);

      successResponse(res, "Employee created successfully");
    } catch (error: any) {
      errorResponse(error, res);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query?.id as string || req.user?.id;
      const user = await userService.getUser(id);
      successResponse(res, "User details fecthed successfully", user);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query?.id as string || req.user?.id;
      const data = await validateUserUpdateBody({ ...req.body, id: userId });
      const user = await userService.updateUser(userId, data);
      successResponse(res, "User details updated successfully", user);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const data = await validateUserStatusBody(req.body);
      const user = await userService.updateUser(data.id, data);
      successResponse(res, "User details updated successfully", user);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async sendSubscriptionStatusMailToUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body?.id as string;

      const expiredSubscriptions = await subscriptionMiscService.getExpiredSubscriptionsOfUser(userId);
      const expiringSoonSubscriptions = await subscriptionMiscService.getExpiringSoonSubscriptionsOfUser(userId);

      for (let sub of expiringSoonSubscriptions) {
        const user = await userService.getUser(sub.createdBy);
        const notificationData: Prisma.NotificationUncheckedCreateInput = {
          userId: user?.id,
          channel: ["EMAIL"],
          templateName: "subscriptionExpiringSoon",
          placeHolders: {
            email: user?.email,
            service: sub.service.name,
            daysLeft: sub.daysLeft,
            name: user?.name,
            plan: sub.plan.name,
            expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
          },
          ccEmails: ""
        }

        await notificationService.createNotification(notificationData);
      }

      for (let sub of expiredSubscriptions) {
        const user = await userService.getUser(sub.createdBy);
        const notificationData: Prisma.NotificationUncheckedCreateInput = {
          userId: user?.id,
          channel: ["EMAIL"],
          templateName: "subscriptionExpired",
          placeHolders: {
            email: user?.email,
            service: sub.service.name,
            daysLeft: sub.daysLeft,
            name: user?.name,
            plan: sub.plan.name,
            expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
          },
          ccEmails: ""
        }

        await notificationService.createNotification(notificationData);
      }
      successResponse(res, "mail sent successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async sendSubscriptionStatusMailToUsers(req: Request, res: Response): Promise<void> {
    try {
      const usersIds = req.body?.ids as string;

      for (let userId of usersIds) {
        const expiredSubscriptions = await subscriptionMiscService.getExpiredSubscriptionsOfUser(userId);
        const expiringSoonSubscriptions = await subscriptionMiscService.getExpiringSoonSubscriptionsOfUser(userId);

        for (let sub of expiringSoonSubscriptions) {
          const user = await userService.getUser(sub.createdBy);
          const notificationData: Prisma.NotificationUncheckedCreateInput = {
            userId: user?.id,
            channel: ["EMAIL"],
            templateName: "subscriptionExpiringSoon",
            placeHolders: {
              email: user?.email,
              service: sub.service.name,
              daysLeft: sub.daysLeft,
              name: user?.name,
              plan: sub.plan.name,
              expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
            },
            ccEmails: ""
          }

          await notificationService.createNotification(notificationData);
        }

        for (let sub of expiredSubscriptions) {
          const user = await userService.getUser(sub.createdBy);
          const notificationData: Prisma.NotificationUncheckedCreateInput = {
            userId: user?.id,
            channel: ["EMAIL"],
            templateName: "subscriptionExpired",
            placeHolders: {
              email: user?.email,
              service: sub.service.name,
              daysLeft: sub.daysLeft,
              name: user?.name,
              plan: sub.plan.name,
              expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
            },
            ccEmails: ""
          }

          await notificationService.createNotification(notificationData);
        }
      }
      successResponse(res, "mails sent successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async deleteProfilePic(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query?.id as string || req.user?.id;
      if (req.body.url) {
        if (process.env.S3Storage === "true") {
          await s3Service.deleteFile(req.body.url);
        } else {
          const filename = path.basename(req.body.url);
          const fileToDelete = path.join(__dirname, "..", "uploads", filename);
          if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
          }
        }
      }
      const data = { imageUrl: "" };
      const user = await userService.updateUser(userId, data);
      successResponse(res, "User Image deleted successfully", user);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }
  async uploadProfilePic(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query?.id as string || req.user?.id;

      // let fileUrl;
      // Multer uploads single file with field name "file"
      upload.single("file")(req, res, async (err) => {
        if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
        if (req.file) {
          const file = req.file;
          let fileUrl = "";

          if (process.env.S3Storage === "true") {
            // S3 upload
            const bucketParamKey = `${process.env.APP_NAME?.replace(" ", "-")}/user/${userId}/profile/${file.filename}`;
            const filePath = file.path;
            const contentType = file.mimetype;
            fileUrl = await s3Service.uploadFile(bucketParamKey, filePath, contentType);
          } else {
            // Local upload
            fileUrl = `${process.env.SERVER_BASE_URL}/uploads/${file.filename}`;
          }

          const data = { imageUrl: fileUrl };
          const user = await userService.updateUser(userId, data);
          successResponse(res, "User Image uploaded successfully", user);
        }
      });
    } catch (error: any) {
      errorResponse(error, res)
    }
  }
  async replaceProfilePic(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query?.id as string || req.user?.id;
      // Multer uploads single file with field name "file"
      upload.single("file")(req, res, async (err) => {
        if (err) return errorResponse({ status: 400, message: "File upload failed" }, res);
        if (req.file) {
          const file = req.file;
          const previousFileUrl = req.body.url;
          let fileUrl = "";

          if (process.env.S3Storage === "true") {
            // S3 logic
            const filePath = file.path;
            const contentType = file.mimetype;
            fileUrl = await s3Service.replaceFile(previousFileUrl, filePath, contentType);
          } else {
            // Local logic
            // Remove previous local file
            if (previousFileUrl) {
              const filename = path.basename(previousFileUrl);
              const fileToDelete = path.join(__dirname, "..", "uploads", filename);
              if (fs.existsSync(fileToDelete)) {
                fs.unlinkSync(fileToDelete);
              }
            }
            fileUrl = `${process.env.SERVER_BASE_URL}/uploads/${file.filename}`;
          }


          const data = { imageUrl: (fileUrl + '?t=' + new Date().getTime()) };
          const user = await userService.updateUser(userId, data);
          successResponse(res, "User Image updated successfully", user);
        }
      });

    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query?.id as string || req.user?.id;
      const subscriptionId = req.query?.subscriptionId;
      const user = await userService.updateUser(userId, { status: "INACTIVE" });

      if (user.imageUrl) {
        if (process.env.S3Storage === "true") {
          await s3Service.deleteFile(user.imageUrl);
        } else {
          const filename = path.basename(user.imageUrl);
          const fileToDelete = path.join(__dirname, "..", "uploads", filename);
          if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
          }
        }
      }

      subscriptionMiscService.decreaseSubscriptionEmployeesFilled(subscriptionId)
      successResponse(res, "Employee Deleted successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body?.id as string;
      userService.updateUser(userId, { status: "INACTIVE" });
      successResponse(res, "User Deleted successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async deleteUsers(req: Request, res: Response): Promise<void> {
    try {
      const userIds = req.body?.ids as string;
      for (let userId of userIds) {
        userService.updateUser(userId, { status: "INACTIVE" });
      }
      successResponse(res, "Users Deleted successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }
}



export const userController = new UserController();
