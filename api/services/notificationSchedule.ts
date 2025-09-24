import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

class NotificationScheduleService {
  async getSchedule(id: string) {
    try {
      return await prisma.notificationSchedule.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async getAllSchedules() {
    try {
      return await prisma.notificationSchedule.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw error;
    }
  }

  async createSchedule(data: Prisma.NotificationScheduleUncheckedCreateInput) {
    try {
      return await prisma.notificationSchedule.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async updateSchedule(data: any) {
    try {
      return await prisma.notificationSchedule.update({
        where: { id: data.id },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteSchedule(id: string) {
    try {
      return await prisma.notificationSchedule.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

}

export const notificationScheduleService = new NotificationScheduleService();
