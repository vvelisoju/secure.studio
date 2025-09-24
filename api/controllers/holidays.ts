import { Request, Response } from "express";
import { Holiday, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const holidayController = {

    async getAllHolidaysFromDashboard(): Promise<Holiday[]> {
        try {
          return await prisma.holiday.findMany();
        } catch (error) {
          throw new Error("Failed to fetch holidays");
        }
      },

  async getAllHolidays(req: Request, res: Response): Promise<void> {
    try {
      const holidays = await prisma.holiday.findMany();
      res.json(holidays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holidays" });
    }
  },

  async getHolidayById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const holiday = await prisma.holiday.findUnique({ where: { id } });
      if (!holiday) {
        res.status(404).json({ error: "Holiday not found" });
        return;
      }
      res.json(holiday);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holiday" });
    }
  },

  async createHoliday(req: Request, res: Response): Promise<void> {
    try {
      const { name, date, description } = req.body;
      const newHoliday = await prisma.holiday.create({
        data: { name, date: new Date(date), description },
      });
      res.status(201).json(newHoliday);
    } catch (error) {
      res.status(500).json({ error: "Failed to create holiday" });
    }
  },

  async updateHoliday(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, date, description } = req.body;
      const updatedHoliday = await prisma.holiday.update({
        where: { id },
        data: { name, date: new Date(date), description },
      });
      res.json(updatedHoliday);
    } catch (error) {
      res.status(500).json({ error: "Failed to update holiday" });
    }
  },

  async deleteHoliday(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.holiday.delete({ where: { id } });
      res.json({ message: "Holiday deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete holiday" });
    }
  },
};
