import Joi from 'joi';
import { prisma } from '../prismaClient';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeRegex = /^(?:[01]?\d|2[0-3]):(00|30)$/; // HH:00 or HH:30 format

const meetingRoomSettingCreateSchema = Joi.object({
    weekdays: Joi.array()
        .items(Joi.string().valid(...weekdays))
        .min(1)
        .required()
        .messages({
            "array.base": "Weekdays must be an array.",
            "array.min": "At least one weekday must be selected.",
            "any.required": "Weekdays are required.",
            "string.base": "Each weekday must be a string.",
            "any.only": `Weekday must be one of: ${weekdays.join(', ')}.`
        }),

    // ... rest of your schema remains the same ...
    startTime: Joi.string()
        .pattern(timeRegex)
        .required()
        .messages({
            "string.base": "Start time must be a string.",
            "string.empty": "Start time cannot be empty.",
            "string.pattern.base": "Start time must be in HH:00 or HH:30 format (24-hour clock).",
            "any.required": "Start time is required."
        }),

    endTime: Joi.string()
        .pattern(timeRegex)
        .required()
        .messages({
            "string.base": "End time must be a string.",
            "string.empty": "End time cannot be empty.",
            "string.pattern.base": "End time must be in HH:00 or HH:30 format (24-hour clock).",
            "any.required": "End time is required."
        })
        .custom((value, helpers) => {
            const startTime = helpers.state.ancestors[0].startTime;
            if (value <= startTime) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            "any.invalid": "End time must be after start time."
        }),

    slotDuration: Joi.number()
        .integer()
        .min(5)
        .max(120)
        .required()
        .messages({
            "number.base": "Slot duration must be a number.",
            "number.integer": "Slot duration must be an integer.",
            "number.min": "Slot duration must be at least 5 minutes.",
            "number.max": "Slot duration cannot exceed 120 minutes.",
            "any.required": "Slot duration is required."
        }),
    pricePerSlot: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Price per slot must be a number.",
            "number.positive": "Price per slot must be a positive value.",
            "any.required": "Price per slot is required."
        })
});

const meetingRoomBookingSchema = Joi.object({
    timeSlotIds: Joi.array()
        .items(Joi.string().uuid())
        .min(1)
        .required()
        .messages({
            "array.base": "Time slot IDs must be an array.",
            "array.min": "At least one time slot must be selected.",
            "any.required": "Time slot IDs are required.",
            "string.base": "Each time slot ID must be a string.",
            "string.guid": "Each time slot ID must be a valid UUID."
        }),

    totalAmount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Total amount must be a number.",
            "number.positive": "Total amount must be a positive value.",
            "any.required": "Total amount is required."
        })
});


export const validateCreateMeetingRoomSetting = async (data: any) => {
    try {
        const validatedData = await meetingRoomSettingCreateSchema.validateAsync(data, { abortEarly: false });
        
        return validatedData;
    } catch (error: any) {
        throw { status: 400, message: error.details[0].message };
    }
};

// Validator with database checks
export const validateAndCheckBookingSlots = async (data: any) => {
    try {
        const validated = await meetingRoomBookingSchema.validateAsync(data, { abortEarly: false });

        const slots = await prisma.timeSlot.findMany({
            where: {
                id: { in: validated.timeSlotIds }
            }
        });

        if (slots.length !== validated.timeSlotIds.length) {
            throw { status: 400, message: "Some slot IDs are invalid or do not exist." };
        }

        const alreadyBooked = slots.find(slot => slot.isBooked);
        if (alreadyBooked) {
            throw { status: 409, message: "One or more selected slots are already booked." };
        }

        return validated;
    } catch (error: any) {
        if (error.isJoi) {
            throw { status: 400, message: error.details[0].message };
        }
        throw error;
    }
};