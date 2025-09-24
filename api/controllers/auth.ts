import { Request, Response } from "express";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { validateAuth, validateOtpVerification, validateResendOtpVerification, } from "../validators/auth";
import { userService, userMiscService } from "../services/user"
import { generateOTP } from "../utils/otp";
import cuid from "cuid";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokenGenerators";
import { validateAuthToken } from "../validators/token";
import { Prisma } from "@prisma/client";
import { mailService } from "../services/mail";
import { otpService } from "../services/otp";
import { convertDatePrimaryStyle, convertTimePrimaryStyle } from "../utils/date";
import { notificationService } from "../services/notification";
import { referralMiscService } from "../services/referral";
import { companyController } from "./company";
import { companyService } from "../services/company";
const refreshLocks: { [key: string]: boolean } = {};

// Set OTP expiry time to 5 minutes from the OTP generation time  
const getOtpExpiryDateTime = (otpGeneratedTime: any) => {
  try {
    const expiryTime = new Date(otpGeneratedTime.getTime() + 5 * 60 * 1000);
    return expiryTime;
  } catch (error) {
    throw (error)
  }
}

class AuthController {

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validateAuth(req?.body);
      console.log(validatedData, "hi");
      // generate OTP details
      const otp: string = generateOTP();
      const otpToken = cuid();
      const otpGeneratedAt = new Date();
      const otpExpiresAt = getOtpExpiryDateTime(otpGeneratedAt);

      // create otp
      await otpService.createOtp({ otp, otpToken, otpExpiresAt, otpGeneratedAt });

      let existingUser: any;
      if (validatedData.type === "login") {
        existingUser = await userMiscService.getUserDetailsforOtp(validatedData.email);
      }

      // create notification record
      const notificationData: Prisma.NotificationUncheckedCreateInput = {
        userId: validatedData.type === "login" ? existingUser?.id : undefined,
        placeHolders: {
          action: validatedData.type,
          name: validatedData.type === "login" ? existingUser.name : validatedData.name,
          email: validatedData.email,
          otp,
        },
        templateName: "otpRequest",
      };
      await notificationService.createNotification(notificationData);
      successResponse(res, "Otp Sent successfully", { otpToken });
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validateOtpVerification(req.body);

      // if account type is register new user is created.
      if (validatedData.type === "register") {
        const referrerId = validatedData.referralCode ? await referralMiscService.getUserIdwithReferralId(validatedData.referralCode) : undefined;

        let companyId;
        if (validatedData.accountType === "COMPANY") {
          const newCompany = await companyService.createCompany({});
          companyId = newCompany.id;
        }
        const userData: Prisma.UserUncheckedCreateInput = {
          name: validatedData.name,
          email: validatedData.email,
          userType: validatedData.accountType === "INDIVIDUAL" ? "USER" : "USER_ADMIN",
          referrerId,
          companyId
        }
        const user: any = await userService.createUser(userData);

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
      const userData = await userMiscService.getUserDetailsforToken(validatedData.email);
      const accessToken: any = await generateAccessToken(userData);
      const refreshToken: any = await generateRefreshToken(userData);
      successResponse(res, "OTP Verified Successfully", { accessToken, refreshToken, user: userData });
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validateResendOtpVerification(req.body);
      // generate OTP details
      const otp: string = generateOTP();
      const otpToken = cuid();
      const otpGeneratedAt = new Date();
      const otpExpiresAt = getOtpExpiryDateTime(otpGeneratedAt);

      // create otp record
      await otpService.createOtp({ otp, otpToken, otpExpiresAt, otpGeneratedAt });

      let existingUser: any;
      if (validatedData.type === "login") {
        existingUser = await userMiscService.getUserDetailsforOtp(validatedData.email);
      }

      // create notification record
      const notificationData: Prisma.NotificationUncheckedCreateInput = {
        userId: existingUser.id,
        placeHolders: {
          action: validatedData.type,
          name: validatedData.type === "login" ? existingUser.name : validatedData.name,
          email: validatedData.email,
          otp,
        },
        templateName: "otpRequest",
      };
      await notificationService.createNotification(notificationData);

      successResponse(res, "Resend OTP successful", { otpToken });
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const googleUser = req?.user;
      const details = googleUser._json;
      console.log(details, "details")
      const existingUser = await userMiscService.checkEmailExists(details.email);

      // if not existing user new user is created.
      if (!existingUser) {
        const userData: Prisma.UserUncheckedCreateInput = {
          name: details.name,
          email: details.email,
          userType: "USER",
        }
        const user: any = await userService.createUser(userData);

        // create notification record
        const notificationData: Prisma.NotificationUncheckedCreateInput = {
          userId: user.id,
          placeHolders: {
            name: user?.name,
            username: user?.name,
            email: user?.email,
            accountType: "INDIVIDUAL",
            registrationDate: convertDatePrimaryStyle(user?.createdAt),
            registrationTime: convertTimePrimaryStyle(user?.createdAt)
          },
          templateName: "registeredUser",
        };
        await notificationService.createNotification(notificationData);
      }
      const userData = await userMiscService.getUserDetailsforToken(details.email);
      const accessToken: any = await generateAccessToken(userData);
      const refreshToken: any = await generateRefreshToken(userData);
      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodedUser}`);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    let lockKey: any;
    try {
      const token = req.body.token;
      await validateAuthToken(token);
      lockKey = `refresh_${token}`;
      if (refreshLocks[lockKey]) throw { status: 429, message: "Token refresh already in progress" };
      refreshLocks[lockKey] = true; // Acquire the lock
      const userData: any = await verifyRefreshToken(token);
      const { iat, exp, ...filteredUserData } = userData; // Remove `iat` and `exp`
      const accessToken = await generateAccessToken(filteredUserData);
      const refreshToken = await generateRefreshToken(filteredUserData);
      successResponse(res, "Token Refreshed Successfully", { accessToken, refreshToken });
    } catch (error: any) {
      errorResponse(error, res)
    } finally {
      delete refreshLocks[lockKey]
    }
  }
}

export const authController = new AuthController();
