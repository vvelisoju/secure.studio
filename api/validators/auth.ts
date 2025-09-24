import Joi, { Schema } from "joi";
import { prisma } from "../prismaClient";




const authSchema = () =>
  Joi.object({
    type: Joi.string()
      .valid("register", "login")
      .required()
      .messages({
        "any.only": "Invalid Authentication.",
        "any.required": "Type is required.",
      }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
      .when("type", {
        is: "registerr",
        then: Joi.string()
          .pattern(/^[^+]+@gmail\.com$/, { name: "no plus sign" }) // Name the pattern to avoid default Joi message
          .messages({
            "string.pattern.name": "No plus signs allowed in email.",
          }),
      })
      .external(async (email, helpers: any) => {
        const { type } = helpers.state.ancestors[0]; // Get type from the parent object
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (type === "login" && !existingUser) throw { status: 404, message: "Email not found. Please sign up first." };
        if (type === "register" && existingUser) throw { status: 409, message: "Email is already registered. Please login." };
      })
      .messages({
        "string.email": "Please provide a valid email address.",
        "string.pattern.base": "Email cannot contain '+' in registration.",
        "any.required": "Email is required.",
      }),

    accountType: Joi.string()
      .valid("INDIVIDUAL", "COMPANY")
      .when("type", {
        is: "register",
        then: Joi.required(),
        otherwise: Joi.optional(), // optional accountType in login
      })
      .messages({
        "any.only": "Account type must be either 'INDIVIDUAL' or 'COMPANY'.",
        "any.required": "Account type is required for registration.",
      }),

    name: Joi.string()
      .min(2)
      .max(50)
      .when("type", {
        is: "register",
        then: Joi.required(),
        otherwise: Joi.optional(), // optional name in login
      })
      .messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot exceed 50 characters.",
        "any.required": "Name is required for registration.",
      }),
  });


// Combined schema for OTP verification (OTP match + OTP expiry)
const otpVerificationSchema = () =>
  Joi.object({
    type: Joi.string()
      .valid("register", "login")
      .required()
      .messages({
        "any.only": "Invalid Authentication.",
        "any.required": "Type is required.",
      }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
      .when("type", {
        is: "registerr",
        then: Joi.string()
          .pattern(/^[^+]+@gmail\.com$/, { name: "no plus sign" }) // Name the pattern to avoid default Joi message
          .messages({
            "string.pattern.name": "No plus signs allowed in email.",
          }),
      })
      .external(async (email, helpers: any) => {
        const { type } = helpers.state.ancestors[0]; // Get type from the parent object
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (type === "login" && !existingUser) throw { status: 404, message: "Email not found. Please sign up first." };
        if (type === "register" && existingUser) throw { status: 409, message: "Email is already registered. Please login." };
      })
      .messages({
        "string.email": "Please provide a valid email address.",
        "string.pattern.base": "Email cannot contain '+' in registration.",
        "any.required": "Email is required.",
      }),

    accountType: Joi.string()
      .valid("INDIVIDUAL", "COMPANY")
      .when("type", {
        is: "register",
        then: Joi.required(),
        otherwise: Joi.optional(), // optional accountType in login
      })
      .messages({
        "any.only": "Account type must be either 'INDIVIDUAL' or 'COMPANY'.",
        "any.required": "Account type is required for registration.",
      }),

    name: Joi.string()
      .min(2)
      .max(50)
      .when("type", {
        is: "register",
        then: Joi.required(),
        otherwise: Joi.optional(), // optional name in login
      })
      .messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot exceed 50 characters.",
        "any.required": "Name is required for registration.",
      }),
    referralCode: Joi.string()
      .optional()
      .trim()
      .allow(null)
      .messages({
        "string.base": "Referral code must be a string.",
      }),
    otp: Joi.string().length(6).required().messages({
      "string.length": "OTP must be 6 digits.",
      "any.required": "OTP is required.",
    }),
    otpToken: Joi.string().required().messages({
      "any.required": "OTP token is required.",
    })
  }).external(async (values, helpers) => {
    const { otp, otpToken } = values;

    // Find the otp details by otp token
    const otpDetails = await prisma.otp.findUnique({
      where: { otpToken },
    });

    console.log("otpDetails", otpDetails);

    if (otpDetails) {
      // Check if OTP and OTP token match
      if (otpDetails.otp !== otp || otpDetails.otpToken !== otpToken) {
        throw { details: [{ message: "Invalid OTP" }] };
      }

      // Check if OTP has expired
      const currentTime = new Date();
      if (otpDetails.otpExpiresAt && currentTime > otpDetails.otpExpiresAt) {
        throw { details: [{ message: "OTP has expired. Please request a new one." }] };
      }
      return values;
    } else {
      throw { details: [{ message: "Invalid OTP or OTP token." }] };
    }
  });

// Combined schema for OTP verification (OTP match + OTP expiry)
const otpResendVerificationSchema = () =>
  Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .when("type", {
        is: "register",
        then: Joi.required(),
        otherwise: Joi.optional(), // optional name in login
      })
      .messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot exceed 50 characters.",
        "any.required": "Name is required for registration.",
      }),
    type: Joi.string()
      .valid("register", "login")
      .required()
      .messages({
        "any.only": "Invalid Authentication.",
        "any.required": "Type is required.",
      }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    otpToken: Joi.string().required().messages({
      "any.required": "OTP token is required.",
    }),
  }).external(async (values) => {
    const { otpToken } = values;

    // Find the otp details
    const otpDetails = await prisma.otp.findUnique({
      where: { otpToken },
    });

    // Check if OTP and OTP token match
    if (!otpDetails) {
      throw { details: [{ message: "Invalid OTP token." }] };
    }
    return values;
  });


export const validateAuth = async (data: any) => {
  try {
    const schema = authSchema();
    const validatedData = await schema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: error?.status || 400, message: error?.message || error.details[0].message };
  }
};

// Function to validate OTP verification (combined)
export const validateOtpVerification = async (data: any) => {
  try {
    const schema = otpVerificationSchema();
    const validatedData = await schema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    console.log(error, "error")
    throw { status: 400, message: error?.details[0]?.message };
  }
};

// Function to validate OTP verification (combined)
export const validateResendOtpVerification = async (data: any) => {
  try {
    const schema = otpResendVerificationSchema();
    const validatedData = await schema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};