import { Request, Response, NextFunction } from "express";
import { couponMiscService } from "../services/coupon";
import { errorResponse, successResponse } from "../middlewares/responseHandler";

class CouponController {
    async reedemCoupon(req: Request, res: Response): Promise<void> {
        try {
            const code = req.body.code;
            const price = parseInt(req.body.price);
            const userId = req.user?.id as string;
            const coupon = await couponMiscService.reedemCoupon(code, price ,userId);
            successResponse(res, "Coupon reedemed successfully", coupon);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

}


export const couponController = new CouponController();
