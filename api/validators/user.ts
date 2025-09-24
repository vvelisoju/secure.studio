import Joi, { Schema } from "joi";
import { UserType } from "@prisma/client";
import { prisma } from "../prismaClient";

// Define the structure of your schema
interface UserSchema {
  name?: Schema;
  email?: Schema;
}

const userSchema = Joi.object<UserSchema>({
  name: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "Name must be a string.",
      "string.empty": "Name cannot be empty.",
    }),

  email: Joi.string()
    .email()
    .required()
    .external(async (email, helpers: any) => {
      const id = helpers.prefs?.context?.id;
      if (!email) return true;
      const existingUser = await prisma.user.findFirst({
        where: id ? { email, NOT: { id } } : {},
      });
      if (existingUser) {
        throw {
          details: [{ message: "This email is already registered. Please use a different one." }],
        };
      }
      return true;
    })
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    })
});


const userUpdateSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()), // Ignore uniqueness check for update

  name: Joi.string().optional().allow(null, "").messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
  }),

  email: Joi.string()
    .email()
    .required()
    .external(async (email, helpers: any) => {
      const { id } = helpers.state.ancestors[0]; // Extract id from the validation data
      if (!email) return true;

      const existingUser = await prisma.user.findFirst({
        where: id ? { email, NOT: { id } } : { email },
      });

      if (existingUser) {
        throw {
          details: [
            { message: "This email is already registered. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),

  phone: Joi.string()
    .optional()
    .allow(null, "")
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit numeric value.",
    }),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .optional()
    .messages({
      "any.only": "Gender must be one of 'MALE', 'FEMALE', or 'OTHER'.",
    }),

  dob: Joi.date().iso().optional().messages({
    "date.base": "Date of Birth must be a valid date.",
    "date.format": "Date of Birth must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ).",
  }),
  address: Joi.string().optional().allow(null, "").messages({
    "string.base": "Address must be a string.",
  }),
  taxInvoice: Joi.boolean()
    .required()
    .messages({
      "any.required": "Tax Invoice flag is required.",
    }),
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE",)
    .optional()
    .messages({
      "any.only": "Status must be one of 'ACTIVE' or 'INACTIVE'.",
    }),
});

const userStatusUpdateSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()), // Ignore uniqueness check for update
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE",)
    .optional()
    .messages({
      "any.only": "Status must be one of 'ACTIVE' or 'INACTIVE'.",
    }),
});

const userCreateSchema = Joi.object({
  name: Joi.string().optional().allow(null, "").messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
  }),

  email: Joi.string()
    .email()
    .required()
    .external(async (email, helpers: any) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw {
          details: [
            { message: "This email is already registered. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),

  phone: Joi.string()
    .optional()
    .allow(null, "")
    .pattern(/^[0-9]{10}$/)
    .external(async (phone) => {
      const existingPhone = await prisma.user.findFirst({
        where: { phone },
      });

      if (existingPhone) {
        throw {
          details: [
            { message: "This phone is already registered. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit numeric value.",
    }),

  dob: Joi.date().iso().optional().messages({
    "date.base": "Date of Birth must be a valid date.",
    "date.format": "Date of Birth must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ).",
  }),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .optional()
    .messages({
      "any.only": "Gender must be one of 'MALE', 'FEMALE', or 'OTHER'.",
    }),

  joiningDate: Joi.date().iso().optional().messages({
    "date.base": "Joining Date must be a valid date.",
    "date.format": "Joining Date must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ).",
  }),

  userType: Joi.string()
    .valid("USER", "USER_ADMIN", "EMPLOYEE") // Adjust valid values based on your `UserType` enum in Prisma
    .required()
    .messages({
      "any.only": "UserType must be either 'USER' or 'ADMIN'.",
      "any.required": "UserType is required.",
    }),
});

const employeeCreateSchema = Joi.object({
  name: Joi.string().optional().allow(null, "").messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
  }),

  email: Joi.string()
    .email()
    .required()
    .external(async (email, helpers: any) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw {
          details: [
            { message: "This email is already registered. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),

  subscriptionId: Joi.string()
    .required()
    .external(async (subscriptionId) => {
      const existingSubscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!existingSubscription) {
        throw {
          details: [
            { message: "This subscription is not purchased. Please use a different one." },
          ],
        };
      }

      if (existingSubscription.employeesAllowed === existingSubscription.employeesFilled) {
        throw {
          details: [
            { message: "This subscription employees limit is over. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.subscriptionId": "Please provide a valid subscriptionId.",
      "any.required": "SubscriptionId is required.",
    }),

  phone: Joi.string()
    .optional()
    .allow(null, "")
    .pattern(/^[0-9]{10}$/)
    .external(async (phone) => {
      const existingPhone = await prisma.user.findFirst({
        where: { phone },
      });

      if (existingPhone) {
        throw {
          details: [
            { message: "This phone is already registered. Please use a different one." },
          ],
        };
      }
    })
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit numeric value.",
    }),

  dob: Joi.date().iso().optional().messages({
    "date.base": "Date of Birth must be a valid date.",
    "date.format": "Date of Birth must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ).",
  }),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .optional()
    .messages({
      "any.only": "Gender must be one of 'MALE', 'FEMALE', or 'OTHER'.",
    }),

  joiningDate: Joi.date().iso().optional().messages({
    "date.base": "Joining Date must be a valid date.",
    "date.format": "Joining Date must be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ).",
  }),

  userType: Joi.string()
    .valid("EMPLOYEE", "USER_ADMIN") // Adjust valid values based on your `UserType` enum in Prisma
    .required()
    .messages({
      "any.only": "UserType must be either 'EMPLOYEE'.",
      "any.required": "UserType is required.",
    }),
  address: Joi.string().optional().allow(null, "").messages({
    "string.base": "Address must be a string.",
  }),
});

export const validateUser = async (data: any) => {
  try {
    const validatedData = await userSchema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};

export const validateUserCreationByAdmin = async (data: any) => {
  try {
    const validatedData = await userCreateSchema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};

export const validateEmployeeDetails = async (data: any) => {
  try {
    const validatedData = await employeeCreateSchema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};


export const validateUserUpdateBody = async (data: any) => {
  try {
    const validatedData = await userUpdateSchema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};

export const validateUserStatusBody = async (data: any) => {
  try {
    const validatedData = await userStatusUpdateSchema.validateAsync(data);
    return validatedData;
  } catch (error: any) {
    throw { status: 400, message: error.details[0].message };
  }
};
