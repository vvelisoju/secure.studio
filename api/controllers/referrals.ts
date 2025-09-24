
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReferralController {
  
  async rewardReferrer(referredUserId: string, rewardAmount: number) {
    try {
      // Get the referrer of the referred user
      const referredUser = await prisma.user.findUnique({
        where: { id: referredUserId },
        select: { referrerId: true }, // Ensure we fetch the referrerId
      });
  
      if (!referredUser?.referrerId) {
        console.log("No referrer found for this user.");
        return;
      }
  
      const referrerId = referredUser.referrerId;
  
      // Create a WalletHistory entry for the referrer
      await prisma.walletHistory.create({
        data: {
          userId: referrerId,
          amount: rewardAmount,
          type: "CREDIT",
          source: "REFERRAL",
          referrerId: referredUserId, // Store who was referred
          description: `Referral bonus for referring user ${referredUserId}`,
        },
      });
  
      console.log(`Referral reward of ${rewardAmount} credited to referrer ${referrerId}`);
    } catch (error) {
      console.error("Error rewarding referrer:", error);
    }
  }

}

export const referralController = new ReferralController();