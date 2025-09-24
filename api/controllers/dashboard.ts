import { Request, Response } from "express";
import { invoiceMiscService } from "../services/invoice";
import { userMiscService, userService } from "../services/user";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { subscriptionMiscService } from "../services/subscription";
import { companyService } from "../services/company";
import { holidayController } from "../controllers/holidays";
import { advanceHistoryController } from "../controllers/advanceHistory";
import { userSubscriptionMiscService } from "../services/userSubscription";
import { advanceHistoryMiscService } from "../services/advanceHistory";
import { walletHistoryMiscService } from "../services/walletHistory";



class DashboardController {
    async getAllDashboardsDetailsUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id as string;
            const dashboard: any = {};

            // Get all required dashboard data.
            const user = await userService.getUser(userId);
            const activeSubscriptions = await userSubscriptionMiscService.getActiveSubscriptions(userId);
            const recentInvoices = await invoiceMiscService.recentInvoices(userId);
            const company = await companyService.getCompany("1f13a4d0-b848-4a77-86b2-195df1283f9d");
            const holidays = await holidayController.getAllHolidaysFromDashboard();
            const advanceAmount = await advanceHistoryMiscService.getUserAdvanceBalance(userId);
            const walletAmount = await walletHistoryMiscService.getUserWalletBalance(userId);
            // add to response.
            dashboard.wallet = user?.wallet;
            dashboard.advance = user?.advance;
            dashboard.activeSubscriptions = activeSubscriptions;
            dashboard.recentInvoices = recentInvoices;
            dashboard.company = company;
            dashboard.holidays = holidays;
            dashboard.advanceAmount = advanceAmount;
            dashboard.walletAmount = walletAmount;
            dashboard.referralCode = user?.referralCode;

            successResponse(res, "Dashboard details fetched successfully", dashboard);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async getAllDashboardsDetailsAdmin(req: Request, res: Response): Promise<void> {
        try {
            const dashboard: any = {};

            // Get all required dashboard data.
            const totalActiveUsers = await userMiscService.getAllActiveUsers();
            const totalRevenueCollected = await invoiceMiscService.totalFinalAmount();
            const totalSecurityDeposits = await advanceHistoryMiscService.getAllAdvanceBalance();
            const upcomingRenewwals = await subscriptionMiscService.getExpiringSoonSubscriptionsCount();
            const userTypesPieChart = await userMiscService.getuserTypesPieChartCount();
            const revenueAreaLineChart = await invoiceMiscService.totalFinalAmountPerMonth();
            // add to response.
            dashboard.totalActiveUsers = totalActiveUsers;
            dashboard.totalRevenueCollected = totalRevenueCollected;
            dashboard.totalSecurityDeposits = totalSecurityDeposits;
            dashboard.upcomingRenewwals = upcomingRenewwals;
            dashboard.userTypesPieChart = userTypesPieChart;
            dashboard.revenueAreaLineChart = revenueAreaLineChart;

            successResponse(res, "Dashboard details fetched successfully", dashboard);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const dashboardController = new DashboardController();
