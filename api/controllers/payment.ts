import { Request, Response } from "express";
import { paymentMiscService, paymentService } from "../services/payment";
import { planMiscService } from "../services/plan";
import { couponMiscService } from "../services/coupon";
import { bookingService, bookingMiscService } from "../services/booking";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { AppSetting, BookingType, Prisma, Subscription, SubscriptionType, User } from "@prisma/client";
import { invoiceMiscService, invoiceService } from "../services/invoice";
import { subscriptionMiscService, subscriptionService } from "../services/subscription";
import { v4 } from "uuid";
import { userSubscriptionMiscService, userSubscriptionService } from "../services/userSubscription";
import { advanceHistoryController } from "./advanceHistory";
import { advanceHistoryMiscService, advanceHistoryService } from "../services/advanceHistory";
import { userMiscService, userService } from "../services/user";
import { validateAndCheckBookingSlots } from "../validators/meetingRoomSetting";
import { timeSlotMiscService } from "../services/timeSlot";
import { appSettingsMiscService } from "../services/appSetting";
import { walletHistoryService } from "../services/walletHistory";
import { invoiceSettingsService } from "../services/invoiceSetting";
import { formatMonthRange } from "../utils/date";
class PaymentController {

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            // Validations Missing

            // For NEW, EXTEND , RENEW
            const bookingType = req.body.bookingType as BookingType;
            const durationDates = req.body.durationDates;
            const subscriptionType = req.body.subscriptionType;
            const userId = req.query?.id as string || (req as any).user?.id;
            const planId = req.body.planId;
            const serviceQuantity: any = parseInt(req.body?.serviceQuantity) || 1;
            const baseAmount = parseFloat(req.body.baseAmount);

            // Only for EXTEND , RENEW
            const previousSubscriptionId = req.body.previousSubscriptionId;

            // Adjusted by ADMIN
            const discountByAdmin = req.body.discountByAdmin || 0;
            const advanceByAdmin = req.body.advanceByAdmin || 0;
            const invoiceDate = req.body?.invoiceDate ? new Date(req.body?.invoiceDate) : undefined;

            // fetch planDetails along with serviceDetails with planId
            const planDetails: any = await planMiscService.getPlanDetailsForOrder(planId);
            const serviceDetails = planDetails.service;

            // calculate totalAmount with quantity
            let totalAmount = 0;
            if (bookingType === "NEW_SUBSCRIPTION") {
                totalAmount = baseAmount;
            } else if (bookingType === "EXTEND_SUBSCRIPTION" || bookingType === "RENEW_SUBSCRIPTION") {
                totalAmount = baseAmount;
            }

            // calculate taxableAmount with discount.
            const taxableAmount = totalAmount - discountByAdmin;

            // calculate each month price for advance.
            // const eachMonthPriceForAdvance = (totalAmount - discountByAdmin)/planDetails?.defaultValue;

            // calculate advance amount
            let advance = 0;
            // if (planDetails?.advanceType === "MONTH") {
            //     advance = (eachMonthPriceForAdvance * planDetails?.advanceValue as number)
            // } else if (planDetails?.advanceType === "AMOUNT") {
            //     advance = (planDetails?.advanceValue as number) * serviceQuantity
            // }

            const appSettings: any = await appSettingsMiscService.getGST() as AppSetting;
            const cgstAmount = ((taxableAmount * appSettings?.cgst || 0) / 100);
            const sgstAmount = ((taxableAmount * appSettings?.sgst || 0) / 100);
            let taxAmount = parseFloat((cgstAmount + sgstAmount).toFixed(2));

            let finalInvoiceAmount = taxableAmount + taxAmount;

            advance += advanceByAdmin
            let totalOrderAmount = taxableAmount + taxAmount + advance;
            let discount = discountByAdmin;

            let couponId;
            // Discount Coupon
            // const coupon = req.body.coupon;
            // if (coupon) {
            //     const couponDetails: any = await couponMiscService.reedemCouponPayment(coupon, totalAmount, userId);
            //     couponId = couponDetails.id;
            //     const discountFor = couponDetails?.discountFor;
            //     if (discountFor === "ADVANCE") {
            //         discount = couponDetails.valueType === "PERCENTAGE" ? (advance * couponDetails.value) / 100 : couponDetails.value * serviceQuantity;
            //         totalAmount = totalAmount - discount;
            //     } else {
            //         discount = couponDetails.valueType === "PERCENTAGE" ? (totalAmount * couponDetails.value) / 100 : couponDetails.value * serviceQuantity;
            //         totalAmount = totalAmount - discount;
            //         taxAmount = (totalAmount * gst) / 100
            //         finalAmount = totalAmount + taxAmount;
            //     }
            // }

            // create order
            const order = await paymentMiscService.createOrder(totalOrderAmount);

            //Booking
            const bookingCode = await bookingMiscService.generateBookingCode();
            const bookingData: Prisma.BookingUncheckedCreateInput = {
                code: bookingCode,
                serviceId: serviceDetails.id,
                userId,
                planId: bookingType === "NEW_SUBSCRIPTION" ? planId : undefined,
                advance,
                quantity: serviceQuantity,
                startTime: bookingType === "NEW_SUBSCRIPTION" ? new Date(durationDates.startTime) : undefined,
                endTime: new Date(durationDates.endTime),
                bookingType,
                previousSubscriptionId: bookingType === "NEW_SUBSCRIPTION" ? undefined : previousSubscriptionId,
            };
            const bookingDetails: any = await bookingService.createBooking(bookingData);

            // Payment 
            const paymentCode = await paymentMiscService.generatePaymentCode();
            const paymentData: Prisma.PaymentUncheckedCreateInput = {
                code: paymentCode,
                userId,
                amount: totalOrderAmount,
                method: "ONLINE",
                razorPayOrderId: order.orderId,
                bookingId: bookingDetails.id, couponId,
                status: "PENDING"
            }
            await paymentService.createPayment(paymentData);

            // Invoice 
            const invoiceSettings: any = await invoiceSettingsService.get();
            const invoiceCode: any = bookingDetails.user.taxInvoice ? invoiceSettings?.taxInvoiceNumber : invoiceSettings?.invoiceNumber;
            const InvoiceData: Prisma.InvoiceUncheckedCreateInput = {
                code: JSON.stringify(invoiceCode),
                totalAmount: totalAmount,
                cgstAmount: cgstAmount,
                sgstAmount: cgstAmount,
                discount,
                finalAmount: finalInvoiceAmount,
                bookingId: bookingDetails.id,
                createdAt: invoiceDate,
                dueDate: new Date(durationDates.endTime),
                effectiveDate: new Date(durationDates.startTime),
                description: bookingType === "MEETING_ROOM" ? " Meeting Room" : planDetails.service.name,
                SAC: planDetails.service.SAC,
                perQuantityAmount: (baseAmount / serviceQuantity),
                quantity: serviceQuantity,
                taxableAmount: taxableAmount,
                type: bookingDetails.user.taxInvoice ? "TAXABLE" : "NON_TAXABLE",
                cgst: appSettings.cgst,
                sgst: appSettings.sgst,
                userId,
                periodOfService: formatMonthRange(durationDates.startTime, durationDates.endTime),
                itemsJson: [{ "id": v4(), "rate": (baseAmount / serviceQuantity), "SAC": planDetails.service.SAC, "amount": totalAmount, "quantity": serviceQuantity, "description": bookingType === "MEETING_ROOM" ? " Meeting Room" : planDetails.service.name }],
            };
            await invoiceService.createInvoice(InvoiceData);

            await invoiceSettingsService.update({
                taxInvoiceNumber: bookingDetails.user.taxInvoice ? invoiceSettings?.taxInvoiceNumber + 1 : invoiceSettings?.taxInvoiceNumber,
                invoiceNumber: bookingDetails.user.taxInvoice ? invoiceSettings?.invoiceNumber : invoiceSettings?.invoiceNumber + 1,
            })

            if (bookingType === "NEW_SUBSCRIPTION") {
                // subscription 
                const subscriptionData: Prisma.SubscriptionUncheckedCreateInput = {
                    serviceId: bookingDetails?.plan?.serviceId,
                    planId: bookingDetails?.plan?.id,
                    status: "HOLD",
                    bookingId: bookingDetails.id,
                    type: subscriptionType as SubscriptionType,
                    employeesFilled: 1,
                    employeesAllowed: serviceQuantity,
                    startTime: new Date(durationDates.startTime),
                    endTime: new Date(durationDates.endTime),
                    createdBy: userId,
                    amount: baseAmount,
                    discount: discountByAdmin
                }
                const newSubscription = await subscriptionService.createSubscription(subscriptionData);
                await userSubscriptionService.createUserSubscription({ userId, subscriptionId: newSubscription?.id, assignedBy: userId });
                await bookingService.updateBooking(bookingDetails.id, {
                    subscriptionId: newSubscription.id,
                });
            } else if (bookingType === "EXTEND_SUBSCRIPTION" || bookingType === "RENEW_SUBSCRIPTION") {
                const subscriptionData: Prisma.SubscriptionUncheckedUpdateInput = {
                    id: previousSubscriptionId,
                    status: bookingType === "RENEW_SUBSCRIPTION" ? "INACTIVE" : "ACTIVE",
                    endTime: new Date(durationDates.endTime),
                    employeesAllowed: serviceQuantity,
                }
                await subscriptionService.updateSubscription(subscriptionData)
            }

            successResponse(res, "Order Created successfully", { bookingId: bookingDetails.id, ...order });
        } catch (error: any) {
            console.log(error)
            errorResponse(error, res)
        }
    }

    async createOrderForMeetingRoom(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = await validateAndCheckBookingSlots(req.body);
            const appSettings: any = await appSettingsMiscService.getGST() as AppSetting;
            let totalAmount = parseFloat((((validatedData.totalAmount * appSettings?.cgst || 0) / 100) + ((validatedData.totalAmount * appSettings?.sgst || 0) / 100)).toFixed(2)) + + validatedData.totalAmount;;

            const timeSlotIds = validatedData.timeSlotIds;
            // create order
            const order = await paymentMiscService.createOrder(totalAmount);
            const userId = req.query?.id as string || (req as any).user?.id;
            //Booking
            const bookingCode = await bookingMiscService.generateBookingCode();
            const bookingData: Prisma.BookingUncheckedCreateInput = {
                code: bookingCode,
                userId,
                quantity: timeSlotIds.length,
                bookingType: "MEETING_ROOM",
            };
            const bookingDetails: any = await bookingService.createBooking(bookingData);

            // Payment 
            const paymentCode = await paymentMiscService.generatePaymentCode();
            const paymentData: Prisma.PaymentUncheckedCreateInput = {
                code: paymentCode,
                userId,
                amount: totalAmount,
                method: "ONLINE",
                razorPayOrderId: order.orderId,
                bookingId: bookingDetails.id,
            }
            await paymentService.createPayment(paymentData);

            // Invoice 
            const invoiceCode = await invoiceMiscService.generateInvoiceCode();
            const InvoiceData: Prisma.InvoiceUncheckedCreateInput = {
                code: invoiceCode,
                totalAmount,
                cgstAmount: 0,
                discount: 0,
                finalAmount: totalAmount,
                bookingId: bookingDetails.id,

                userId
            };
            await invoiceService.createInvoice(InvoiceData);

            // update all slots booking Ids.
            await timeSlotMiscService.updateManySlotsForOnlinePayment(timeSlotIds, { isBooked: true, bookingId: bookingDetails.id });

            //update user 
            const freeSlotsCount: any = await userMiscService.getFreeMeetingRoomSlots(userId);
            await userService.updateUser(userId, { freeMeetingRoomSlots: freeSlotsCount - timeSlotIds.length <= 0 ? 0 : freeSlotsCount - timeSlotIds.length })

            successResponse(res, "Order Created successfully", order);
        } catch (error: any) {
            console.log(error)
            errorResponse(error, res)
        }
    }


    async verifyPayment(orderEntity: any, paymentEntity: any): Promise<void> {
        try {
            const razorpay_order_id = orderEntity.id;
            const razorpay_payment_id = paymentEntity.id;
            const payment: any = await paymentMiscService.getPaymentDetailsByOrderId(razorpay_order_id);
            const bookingDetails: any = payment.booking;
            const userId = payment?.userId;
            const paymentData: Prisma.PaymentUncheckedUpdateInput = {
                razorPayOrderId: razorpay_order_id,
                status: "COMPLETED",
                razorPayPaymentId: razorpay_payment_id,
                paymentCompletedAt: new Date()
            }
            await paymentService.updatePayment(payment.id, paymentData);
            const bookingData: Prisma.BookingUncheckedUpdateInput = { status: "CONFIRMED", }
            const booking: any = await bookingMiscService.updateBookingForPaymentVerification(bookingDetails.id, bookingData);


            if (bookingDetails.bookingType as BookingType === "MEETING_ROOM") {
                // update all slots booking Ids.
                const ids = booking.timeSlots.map((slot: any) => slot.id);
                await timeSlotMiscService.updateManySlotsForOnlinePayment(ids, { userId });
            } else {
                const subscription: any = bookingDetails.subscription;
                const subscriptionId = (bookingDetails.bookingType === "RENEW_SUBSCRIPTION" || bookingDetails.bookingType === "EXTEND_SUBSCRIPTION") ? bookingDetails.previousSubscriptionId : subscription.id;

                if (payment.couponId) await couponMiscService.createCouponUser({ userId, couponId: payment.couponId });
                await subscriptionService.updateSubscription({ id: subscriptionId, status: "ACTIVE" });

                if (booking?.advance > 0) {
                    // create advance history
                    const code = await advanceHistoryMiscService.generateReceiptCode();
                    const advanceHistoryData: Prisma.AdvanceHistoryUncheckedCreateInput = { code, amount: booking?.advance, userId, type: "GIVEN", description: bookingDetails?.service?.name }
                    await advanceHistoryService.createAdvanceHistory(advanceHistoryData);
                }

                // update free meeting room slots 
                const previousHours = await userMiscService.getFreeMeetingRoomSlots(userId);
                const freeMeetingRoomSlots = previousHours + bookingDetails?.plan?.freeMeetingRoomSlots;
                await userService.updateUser(userId, { freeMeetingRoomSlots });
            }

            // check if this is the first subscrption made by user
            const firstSubscription = await userSubscriptionMiscService.checkFirstSubscriptionForReferralGift(userId);

            if (firstSubscription && (bookingDetails.user as User).referrerId) {
                // create a wallet History
                const walletHistoryData: Prisma.WalletHistoryUncheckedCreateInput = {
                    userId: (bookingDetails.user as User).referrerId as string,
                    amount: 1000,
                    type: "CREDIT",
                    source: "REFERRAL",
                    referrerId: userId,
                    description: "Added for first subscrption made by user."
                }
                await walletHistoryService.create(walletHistoryData);
            }
            return;
        } catch (error) {
            console.error("Error at verify payment", error)
        }
    }

    async failedPayment(paymentEntity: any): Promise<void> {
        try {
            const razorpay_order_id = paymentEntity.order_id;
            const razorpay_payment_id = paymentEntity.id;
            const payment: any = await paymentMiscService.getPaymentDetailsByOrderId(razorpay_order_id);
            const bookingDetails: any = payment.booking;

            const paymentData: Prisma.PaymentUncheckedUpdateInput = {
                razorPayOrderId: razorpay_order_id,
                status: "FAILED",
                razorPayPaymentId: razorpay_payment_id
            }
            await paymentService.updatePayment(payment.id, paymentData);
            const bookingData: Prisma.BookingUncheckedUpdateInput = { status: "FAILED" }
            await bookingService.updateBooking(bookingDetails.id, bookingData)
            return;
        } catch (error) {
            console.error("Error at verify payment", error)
        }
    }

    // async payQuotedSubscription(req: Request, res: Response): Promise<void> {
    //     try {

    //         const subscriptionId = req.body.previousSubscriptionId;
    //         const durationDates = req.body?.durationDates;
    //         const invoiceDate = req.body?.invoiceDate ? new Date(req.body?.invoiceDate) : undefined;
    //         const serviceQuantity: any = parseInt(req.body?.serviceQuantity) || 1;
    //         const discountByAdmin = req.body.discountByAdmin || 0;
    //         const baseAmount = parseFloat(req.body.baseAmount);

    //         // get subscription details with id;


    //         // update booking details

    //         // update payment details

    //         // update subscription details

    //     } catch (error) {

    //     }
    // }

    async offline(req: Request, res: Response): Promise<void> {
        try {
            // Validations Missing
            // const isQuoted = req.body.isQuoted;
            // if (isQuoted) {
            //     this.payQuotedSubscription(req, res)
            // }
            const bookingTab = req.body.bookingTab;
            // For NEW, EXTEND , RENEW
            const bookingType = req.body.bookingType as BookingType;
            const durationDates = req.body?.durationDates;
            const subscriptionType = req.body.subscriptionType;
            const userId = req.query?.id as string || (req as any).user?.id;
            const planId = req.body.planId;
            const serviceQuantity: any = parseInt(req.body?.serviceQuantity) || 1;
            const baseAmount = parseFloat(req.body.baseAmount);

            // Only for EXTEND , RENEW
            const previousSubscriptionId = req.body.previousSubscriptionId;

            // Adjusted by ADMIN
            const discountByAdmin = req.body.discountByAdmin || 0;
            const advanceByAdmin = req.body.advanceByAdmin || 0;
            const invoiceDate = req.body?.invoiceDate ? new Date(req.body?.invoiceDate) : undefined;

            // fetch planDetails along with serviceDetails with planId
            const planDetails: any = await planMiscService.getPlanDetailsForOrder(planId);
            const subscriptionAmount = planDetails.price * planDetails.defaultValue;
            const serviceDetails = planDetails?.service;

            // calculate totalAmount with quantity
            let totalAmount = 0;

            if (bookingType === "NEW_SUBSCRIPTION") {
                totalAmount = baseAmount;
            } else if (bookingType === "EXTEND_SUBSCRIPTION" || bookingType === "RENEW_SUBSCRIPTION") {
                totalAmount = baseAmount;
            }

            // calculate taxableAmount with discount.
            let taxableAmount = totalAmount - discountByAdmin;
            taxableAmount = totalAmount;


            // calculate each month price for advance.
            // const eachMonthPriceForAdvance = (totalAmount - discountByAdmin)/planDetails?.defaultValue;

            let advance = 0;
            // if (planDetails?.advanceType === "MONTH") {
            //     advance = (eachMonthPriceForAdvance * planDetails?.advanceValue as number)
            // } else if (planDetails?.advanceType === "AMOUNT") {
            //     advance = (planDetails?.advanceValue as number) * serviceQuantity
            // }

            // tax realted
            const appSettings: any = await appSettingsMiscService.getGST() as AppSetting;
            const cgstAmount = ((taxableAmount * appSettings?.cgst || 0) / 100);
            const sgstAmount = ((taxableAmount * appSettings?.sgst || 0) / 100);
            let taxAmount = parseFloat((cgstAmount + sgstAmount).toFixed(2));


            let finalInvoiceAmount = taxableAmount + taxAmount;

            advance += advanceByAdmin;
            let totalOrderAmount = taxableAmount + taxAmount + advance;
            let discount = discountByAdmin;

            let couponId;
            // Discount Coupon
            // const coupon = req.body.coupon;
            // if (coupon) {
            //     const couponDetails: any = await couponMiscService.reedemCouponPayment(coupon, totalAmount, userId);
            //     couponId = couponDetails.id;
            //     const discountFor = couponDetails?.discountFor;
            //     if (discountFor === "ADVANCE") {
            //         discount = couponDetails.valueType === "PERCENTAGE" ? (advance * couponDetails.value) / 100 : couponDetails.value * serviceQuantity;
            //         totalAmount = totalAmount - discount;
            //     } else {
            //         discount = couponDetails.valueType === "PERCENTAGE" ? (totalAmount * couponDetails.value) / 100 : couponDetails.value * serviceQuantity;
            //         totalAmount = totalAmount - discount;
            //         taxAmount = (totalAmount * gst) / 100;
            //         finalAmount = totalAmount + taxAmount;
            //     }
            // }

            if (advance > 0) {
                // create advance history
                const code = await advanceHistoryMiscService.generateReceiptCode();
                const advanceHistoryData: Prisma.AdvanceHistoryUncheckedCreateInput = { code, amount: advance, userId, type: "GIVEN", description: planDetails?.service?.name }
                await advanceHistoryService.createAdvanceHistory(advanceHistoryData);
            }

            //Booking
            const bookingCode = await bookingMiscService.generateBookingCode();
            const bookingData: Prisma.BookingUncheckedCreateInput = {
                startTime: bookingType === "NEW_SUBSCRIPTION" ? new Date(durationDates.startTime) : undefined,
                endTime: new Date(durationDates.endTime),
                status: bookingTab === "Quotation" ? "QUOTED" : "CONFIRMED",
                code: bookingCode,
                serviceId: serviceDetails.id,
                userId,
                planId: bookingType === "NEW_SUBSCRIPTION" ? planId : undefined,
                advance,
                quantity: serviceQuantity,
                bookingType,
                subscriptionId: bookingType === "NEW_SUBSCRIPTION" ? undefined : previousSubscriptionId,

            };
            const bookingDetails: any = await bookingService.createBooking(bookingData);

            // Payment 
            const paymentCode = await paymentMiscService.generatePaymentCode();
            const paymentData: Prisma.PaymentUncheckedCreateInput = {
                paymentCompletedAt: new Date(),
                status: bookingTab === "Quotation" ? "QUOTED" : "COMPLETED",
                code: paymentCode, userId, amount: totalOrderAmount, method: "OFFLINE",
                transactionId: req.body?.transactionId || v4(), bookingId: bookingDetails.id, couponId
            }
            await paymentService.createPayment(paymentData);

            // Invoice 
            const invoiceSettings: any = await invoiceSettingsService.get();
            const invoiceCode: any = bookingDetails.user.taxInvoice ? invoiceSettings?.taxInvoiceNumber : invoiceSettings?.invoiceNumber;
            const InvoiceData: Prisma.InvoiceUncheckedCreateInput = {
                code: JSON.stringify(invoiceCode),
                totalAmount,
                cgstAmount: cgstAmount,
                sgstAmount: sgstAmount,
                discount,
                finalAmount: finalInvoiceAmount,
                bookingId: bookingDetails.id,
                createdAt: invoiceDate,
                dueDate: new Date(durationDates.endTime),
                effectiveDate: new Date(durationDates.startTime),
                description: bookingType === "MEETING_ROOM" ? " Meeting Room" : planDetails.service.name,
                SAC: planDetails.service.SAC,
                perQuantityAmount: (baseAmount / serviceQuantity),
                quantity: serviceQuantity,
                taxableAmount: taxableAmount,
                type: bookingDetails.user.taxInvoice ? "TAXABLE" : "NON_TAXABLE",
                cgst: appSettings?.cgst,
                sgst: appSettings?.sgst,
                userId,
                periodOfService: formatMonthRange(durationDates.startTime, durationDates.endTime),
                itemsJson: [{ "id": v4(), "rate": (baseAmount / serviceQuantity), "SAC": planDetails.service.SAC, "amount": totalAmount, "quantity": serviceQuantity, "description": bookingType === "MEETING_ROOM" ? " Meeting Room" : planDetails.service.name }],
            };
            await invoiceService.createInvoice(InvoiceData);
            await invoiceSettingsService.update({
                taxInvoiceNumber: bookingDetails.user.taxInvoice ? invoiceSettings?.taxInvoiceNumber + 1 : invoiceSettings?.taxInvoiceNumber,
                invoiceNumber: bookingDetails.user.taxInvoice ? invoiceSettings?.invoiceNumber : invoiceSettings?.invoiceNumber + 1,
            })

            if (bookingType === "NEW_SUBSCRIPTION") {
                // subscription 
                const subscriptionData: Prisma.SubscriptionUncheckedCreateInput = {
                    serviceId: bookingDetails?.plan?.serviceId,
                    planId: bookingDetails?.plan?.id,
                    status: bookingTab === "Quotation" ? "QUOTED" : "ACTIVE",
                    bookingId: bookingDetails.id,
                    type: subscriptionType as SubscriptionType,
                    employeesFilled: 1,
                    employeesAllowed: serviceQuantity,
                    startTime: new Date(durationDates.startTime),
                    endTime: new Date(durationDates.endTime),
                    createdBy: userId,
                    amount: subscriptionAmount,
                    discount: discountByAdmin
                }
                const newSubscription = await subscriptionService.createSubscription(subscriptionData);
                await bookingService.updateBooking(bookingDetails.id, {
                    subscriptionId: newSubscription.id,
                });
                await userSubscriptionService.createUserSubscription({ userId, subscriptionId: newSubscription?.id, assignedBy: userId });
            } else if (bookingType === "EXTEND_SUBSCRIPTION" || bookingType === "RENEW_SUBSCRIPTION") {
                const subscriptionData: Prisma.SubscriptionUpdateInput = {
                    id: previousSubscriptionId,
                    status: "ACTIVE",
                    endTime: new Date(durationDates.endTime),
                    employeesAllowed: serviceQuantity,
                }
                await subscriptionService.updateSubscription(subscriptionData)
            }

            // update free meeting room slots 
            const previousHours = await userMiscService.getFreeMeetingRoomSlots(userId);
            const freeMeetingRoomSlots = previousHours + planDetails?.freeMeetingRoomSlots;
            await userService.updateUser(userId, { freeMeetingRoomSlots });

            // check if this is the first subscrption made by user
            const firstSubscription = await userSubscriptionMiscService.checkFirstSubscriptionForReferralGift(userId);

            if (firstSubscription && (bookingDetails.user as User).referrerId) {
                // create a wallet History
                const walletHistoryData: Prisma.WalletHistoryUncheckedCreateInput = {
                    userId: (bookingDetails.user as User).referrerId as string,
                    amount: 1000,
                    type: "CREDIT",
                    source: "REFERRAL",
                    referrerId: userId,
                    description: "Added for first subscrption made by user."
                }
                await walletHistoryService.create(walletHistoryData);
            }

            const booking = await bookingMiscService.updateBookingForPaymentVerification(bookingDetails.id, {});
            successResponse(res, "Service Booked successfully", booking);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async cancelOrder(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            const bookingDetails: any = await bookingService.getBookingById(bookingId);
            const payment: any = bookingDetails.payment;
            const paymentData: Prisma.PaymentUncheckedUpdateInput = { status: "CANCELLED" }
            await paymentService.updatePayment(payment.id, paymentData);
            const bookingData: Prisma.BookingUncheckedUpdateInput = { status: "CANCELLED" }
            await bookingService.updateBooking(bookingDetails.id, bookingData)
            successResponse(res, "Order Cancelled successfully");
        } catch (error) {
            errorResponse(error, res)
        }
    }

    async paymentFail(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            const bookingDetails: any = await bookingService.getBookingById(bookingId);
            const payment: any = bookingDetails.payment;
            const paymentData: Prisma.PaymentUncheckedUpdateInput = { status: "FAILED" }
            await paymentService.updatePayment(payment.id, paymentData);
            const bookingData: Prisma.BookingUncheckedUpdateInput = { status: "FAILED" }
            await bookingService.updateBooking(bookingDetails.id, bookingData)
            successResponse(res, "Payment FAILED successfully");
        } catch (error) {
            errorResponse(error, res)
        }
    }
}

export const paymentController = new PaymentController();
