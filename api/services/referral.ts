import { User } from "@prisma/client";
import { prisma } from "../prismaClient";

class ReferralMiscService {

    async getUserIdwithReferralId(referralCode: string) {
        try {
            const user = await prisma.user.findUnique({ where: { referralCode } }) as User;
            return user.id;
        } catch (error) {
            throw (error)
        }
    }

}


export const referralMiscService = new ReferralMiscService();

