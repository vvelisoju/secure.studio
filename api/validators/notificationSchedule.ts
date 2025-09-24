import Joi from 'joi';
import { prisma } from '../prismaClient';

const notificationScheduleCreateSchema = Joi.object({
    description: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            "string.base": "Description must be a string.",
            "string.empty": "Description cannot be empty.",
            "any.required": "Description is required."
        }),

    daysBefore: Joi.array()
        .items(
            Joi.number()
                .integer()
                .min(0)
                .messages({
                    "number.base": "Each day must be a number.",
                    "number.integer": "Each day must be an integer.",
                    "number.min": "Days before must be zero or a positive number."
                })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Days before must be an array.",
            "array.min": "At least one day before must be specified.",
            "any.required": "Days before is required."
        }),

    // Optional for in-app
    title: Joi.string()
        .allow(null, '')
        .messages({
            "string.base": "Title must be a string."
        }),

    body: Joi.string()
        .allow(null, '')
        .messages({
            "string.base": "Body must be a string."
        }),

    // Required for email/whatsapp
    notificationTemplateId: Joi.string()
        .required()
        .messages({
            "string.base": "Notification template ID must be a string.",
            "any.required": "Notification template ID is required."
        })
        .external(async (notificationTemplateId: string) => {
            if (!notificationTemplateId) return; // skip DB check if not provided
            const existing = await prisma.notificationTemplate.findUnique({ where: { id: notificationTemplateId } });
            if (!existing) throw { status: 404, message: "Notification Template not found." };
        })
});


const notificationScheduleUpdateSchema = Joi.object({
    id: Joi.string()
        .required()
        .external(async (id: string) => {
            const existing = await prisma.notificationSchedule.findUnique({ where: { id } });
            if (!existing) throw { status: 404, message: "Notification Schedule not found." };
        })
        .messages({
            "string.base": "ID must be a string.",
            "any.required": "ID is required for update."
        }),

    description: Joi.string()
        .trim()
        .min(1)
        .messages({
            "string.base": "Description must be a string.",
            "string.empty": "Description cannot be empty."
        }),

    daysBefore: Joi.array()
        .items(
            Joi.number()
                .integer()
                .min(0)
                .messages({
                    "number.base": "Each day must be a number.",
                    "number.integer": "Each day must be an integer.",
                    "number.min": "Days before must be zero or a positive number."
                })
        )
        .messages({
            "array.base": "Days before must be an array."
        }),

    title: Joi.string()
        .allow(null, '')
        .messages({
            "string.base": "Title must be a string."
        }),

    body: Joi.string()
        .allow(null, '')
        .messages({
            "string.base": "Body must be a string."
        }),

    notificationTemplateId: Joi.string()
        .external(async (notificationTemplateId: string) => {
            const existing = await prisma.notificationTemplate.findUnique({ where: { id: notificationTemplateId } });
            if (!existing) throw { status: 404, message: "Notification Template not found." };
        })
        .messages({
            "string.base": "Notification template ID must be a string.",
        })
});

export const validateUpdateNotificationSchedule = async (data: any) => {
    try {
        const validatedData = await notificationScheduleUpdateSchema.validateAsync(data, { abortEarly: false });
        return validatedData;
    } catch (error: any) {
        throw { status: error?.status || 400, message: error?.message || error.details[0].message };
    }
};

export const validateCreateNotificationSchedule = async (data: any) => {
    try {
        const validatedData = await notificationScheduleCreateSchema.validateAsync(data, { abortEarly: false });
        return validatedData;
    } catch (error: any) {
        throw { status: error?.status || 400, message: error?.message || error.details[0].message };
    }
};
