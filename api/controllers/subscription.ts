import { Request, Response, NextFunction } from "express";
import { subscriptionMiscService, subscriptionService } from "../services/subscription";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { userSubscriptionMiscService, userSubscriptionService } from "../services/userSubscription";
import { invoiceService } from "../services/invoice";
import { bookingMiscService, bookingService } from "../services/booking";
import { paymentMiscService, paymentService } from "../services/payment";
import { PaymentStatus } from "@prisma/client";

class SubscriptionController {
  async updateAdminAllowed(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionId = req?.body?.id;
      const value = req?.body?.value[0];
      if (value === "ALLOWED") {
        await userSubscriptionService.updateUserSubscription(req.user.id, subscriptionId, { isSubscriptionUsed: true });
        await subscriptionMiscService.increaseSubscriptionEmployeesFilled(subscriptionId);
      } else {
        await userSubscriptionService.updateUserSubscription(req.user.id, subscriptionId, { isSubscriptionUsed: false });
        await subscriptionMiscService.decreaseSubscriptionEmployeesFilled(subscriptionId);
      }
      successResponse(res, "User details updated successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }
  async deleteSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionId = req?.query?.id as string;

      await subscriptionService.updateSubscription({ id: subscriptionId, status: "DELETED" });
      const ids: any = await bookingMiscService.fetchAllBookingsWithSubscriptionId(subscriptionId);
      for (let bookingId of ids?.bookingIds) {
        await bookingMiscService.updateBookingStatusToCancelWithId(bookingId);
      }
      for (let paymentId of ids?.paymentIds) {
        await paymentMiscService.updatePaymentStatusToCancel(paymentId);
      }
      for (let invoiceId of ids?.invoiceIds) {
        await invoiceService.updateInvoice({ id: invoiceId, status: false });
      }


      successResponse(res, "Subscription Cancelled successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async updateSubscriptionOfUser(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const subscription = await subscriptionService.updateSubscription({ ...body, amount: parseFloat(body?.amount || 0), discount: parseFloat(body?.discount || 0) });
      successResponse(res, "Subscription updated successfully", subscription);
    } catch (error: any) {
      errorResponse(error, res)
    }
  }

  async activateQuotedSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionId = req?.body?.id as string;
      const subscription = await subscriptionService.updateSubscription({ id: subscriptionId, status: "ACTIVE" });
      const updatedBooking: any = await bookingMiscService.updateBookingStatusForQuoted(subscription?.bookingId, { status: "CONFIRMED" });
      await paymentService.updatePayment(updatedBooking?.payment?.id, { status: "COMPLETED" })
      successResponse(res, "Subscription Activated successfully");
    } catch (error: any) {
      errorResponse(error, res)
    }
  }
}

export const subscriptionController = new SubscriptionController();
