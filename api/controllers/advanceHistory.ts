import { Request, Response } from "express";
import { advanceHistoryMiscService, advanceHistoryService } from "../services/advanceHistory";
import { errorResponse, successResponse } from "../middlewares/responseHandler";

export const advanceHistoryController = {
  async createAdvanceHistory(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body; // need validation
      const code = await advanceHistoryMiscService.generateReceiptCode();
      const advanceBalanceHistory = await advanceHistoryService.createAdvanceHistory({ code, ...body });
      successResponse(res, "Advance Balance Histroy created successfully", advanceBalanceHistory);
    } catch (error) {
      errorResponse(error, res);
    }
  },
  async update(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body; // validation required
      const advanceBalanceHistory = await advanceHistoryService.updateAdvanceHistory(body);
      successResponse(res, "Advance Histroy updated successfully", advanceBalanceHistory);
    } catch (error) {
      errorResponse(error, res);
    }
  },

  // Get total advance balance for a user, considering type
  async getUserAdvanceBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = req?.user?.id;
      const advanceBalance = await advanceHistoryMiscService.getUserAdvanceBalance(userId);
      successResponse(res, "Advance Balance fetched successfully", advanceBalance);
    } catch (error) {
      errorResponse(error, res);
    }
  },

  async getUserAdvanceHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId: any = req?.query?.userId || req?.user?.id;
      const advanceBalanceHistory = await advanceHistoryMiscService.getUserAdvanceHistory(userId);
      successResponse(res, "Advance Balance Histroy fetched successfully", advanceBalanceHistory);
    } catch (error) {
      errorResponse(error, res);
    }
  },
  async getUserGivenAdvanceHistoryList(req: Request, res: Response): Promise<void> {
    try {
      const userId: any = req?.query?.userId || req?.user?.id;
      const advanceBalanceHistory = await advanceHistoryMiscService.getUserGivenAdvanceHistory(userId);
      successResponse(res, "Given Advance Balance Histroy fetched successfully", advanceBalanceHistory);
    } catch (error) {
      errorResponse(error, res);
    }
  }
};
