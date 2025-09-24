import Joi from "joi";
import { prisma } from "../prismaClient";

const companySchema = Joi.object({
    id: Joi.string()
        .required()
        .external(async (id) => {
            const existingCompany = await prisma.company.findUnique({ where: { id } });
            if (!existingCompany) {
                throw {
                    details: [{ message: "Company ID does not exist. Please provide a valid ID." }],
                };
            }
        })
        .messages({
            "any.required": "Company ID is required.",
            "string.base": "Company ID must be a string.",
        }),
    name: Joi.string().optional().allow(null, "").messages({
        "string.base": "Company name must be a string.",
        "string.empty": "Company name cannot be empty.",
    }),

    GSTIN: Joi.string().optional().allow(null, "").messages({
        "string.base": "GSTIN must be a string.",
    }),

    PAN: Joi.string().optional().allow(null, "").messages({
        "string.base": "PAN must be a string.",
    }),

    address: Joi.string().optional().allow(null, "").messages({
        "string.base": "Address must be a string.",
    }),
    websiteUrl: Joi.string().optional().allow(null, "").messages({
        "string.base": "Website Url must be a string.",
    }),
    employeeRange: Joi.string()
        .valid("ONE_TO_FIVE", "SIX_TO_TEN", "ELEVEN_TO_TWENTY", "TWENTY_PLUS")
        .default("ONE_TO_FIVE")
        .messages({
            "any.only": "Employee range must be one of 'ONE_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', or 'TWENTY_PLUS'.",
        })
});


const companyCreateSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Company name must be a string.",
        "string.empty": "Company name cannot be empty.",
    }),

    GSTIN: Joi.string().optional().allow(null, "").messages({
        "string.base": "GSTIN must be a string.",
    }),

    PAN: Joi.string().optional().allow(null, "").messages({
        "string.base": "PAN must be a string.",
    }),

    address: Joi.string().optional().allow(null, "").messages({
        "string.base": "Address must be a string.",
    }),
    websiteUrl: Joi.string().optional().allow(null, "").messages({
        "string.base": "Website Url must be a string.",
    }),
    employeeRange: Joi.string()
        .valid("ONE_TO_FIVE", "SIX_TO_TEN", "ELEVEN_TO_TWENTY", "TWENTY_PLUS")
        .default("ONE_TO_FIVE")
        .messages({
            "any.only": "Employee range must be one of 'ONE_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', or 'TWENTY_PLUS'.",
        })
});

export const validateUpdateCompany = async (data: any) => {
    try {
        const validatedData = await companySchema.validateAsync(data);
        return validatedData;
    } catch (error: any) {
        throw { status: 400, message: error.details[0].message };
    }
};


export const validateCreateCompany = async (data: any) => {
    try {
        const validatedData = await companyCreateSchema.validateAsync(data);
        return validatedData;
    } catch (error: any) {
        throw { status: 400, message: error.details[0].message };
    }
};
