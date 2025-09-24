import { prisma } from "../prismaClient";
import { Prisma, User, UserType } from "@prisma/client";

import { advanceHistoryMiscService } from "./advanceHistory";
import { superAdminMiscService, superAdminService } from "./superAdmin";
import { generateReferralCode } from "../utils/referral";
import axios from 'axios';

export class UserService {

  async getAllUsers(page: number = 1, limit: number = 10, search: string = "", userTypes: any, userStatus: any, subscriptionStatus: any, joiningFrom: any, joiningTo: any, bringTrialUsers: any, invoiceTypes: any, dates: any) {
    try {

      const orConditions = [];

      if (bringTrialUsers) {
        orConditions.push({
          UserSubscriptions: {
            none: {}
          }
        });
      }

      // Always include users with valid subscriptions
      orConditions.push({
        UserSubscriptions: {
          some: {
            subscription: {
              status: {
                in: subscriptionStatus,
              },
              endTime: {
                lte: dates?.threeDaysLater,
                gte: dates?.now,
              }
            }
          }
        }
      });

      const [data, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: {
            taxInvoice: invoiceTypes,
            userType: { in: userTypes },
            status: { in: userStatus },
            ...(joiningFrom || joiningTo
              ? {
                joiningDate: {
                  ...(joiningFrom ? { gte: new Date(joiningFrom) } : {}),
                  ...(joiningTo ? { lte: new Date(joiningTo) } : {}),
                },
              }
              : {}),


            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
            AND: [
              {
                OR: orConditions
              }
            ],
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            company: true, UserSubscriptions: {
              where: {
                subscription: {
                  status: {
                    in: subscriptionStatus,
                    notIn: ["DELETED", "HOLD"]
                  },
                  endTime: {
                    lte: dates?.threeDaysLater,
                    gte: dates?.now
                  }
                },
              }, include: { subscription: { include: { service: true } }, }
            }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.user.count({
          where: {
            taxInvoice: invoiceTypes,
            userType: { in: userTypes },
            status: { in: userStatus },
            ...(joiningFrom || joiningTo
              ? {
                joiningDate: {
                  ...(joiningFrom ? { gte: new Date(joiningFrom) } : {}),
                  ...(joiningTo ? { lte: new Date(joiningTo) } : {}),
                },
              }
              : {}),


            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
            AND: [
              {
                OR: orConditions
              }
            ],
          },
        })
      ]);
      const dataModified = [];
      const admins = await superAdminService.getAllAdmins();
      const adminsIdsArray = admins.map(admin => admin.user.id)
      for (let item of data) {
        const advanceHistory: any = await advanceHistoryMiscService.getUserAdvanceBalance(item.id);
        dataModified.push({ ...item, advance: advanceHistory.totalAdvance, userType: adminsIdsArray.includes(item.id) ? "SUPER_ADMIN" : item.userType });
      }
      const serialNumbers = Array.from({ length: dataModified.length }, (_, i) => (page - 1) * limit + i + 1);
      const users = dataModified.map((user, index) => ({ ...user, serialNumber: serialNumbers[index] }));
      return { users, totalCount };
    } catch (error) {
      throw (error)
    }
  }


  async getUser(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          company: {
            include: { account: true }
          }
        }
      });

      if (!user) return null;

      // If company and company.logoUrl exist, fetch logoBase64 from S3
      if (user.company?.logoUrl) {
        try {
          const response = await axios.get(user.company.logoUrl, { responseType: 'arraybuffer' });
          const contentType = response.headers['content-type'] || 'image/jpeg';
          const base64Image = Buffer.from(response.data, 'binary').toString('base64');
          (user.company as any).logoBase64 = `data:${contentType};base64,${base64Image}`;
        } catch (fetchError) {
          console.error("Failed to fetch company logo from S3:", fetchError);
        }
      }

      const isAdmin = await superAdminMiscService.isAdmin(user.id);

      return {
        ...user,
        userType: isAdmin ? UserType.SUPER_ADMIN : user.userType,
      };

    } catch (error) {
      throw error;
    }
  }

  async createUser(data: Prisma.UserUncheckedCreateInput) {
    try {
      // Generate a referral code for the new user
      const referralCode = generateReferralCode();
      return await prisma.user.create({ data: { ...data, referralCode } });
    } catch (error) {
      throw (error)
    }
  }

  async updateUser(id: string, data: Prisma.UserUncheckedUpdateInput) {
    try {
      const user = await prisma.user.update({ where: { id }, data, include: { company: true } });
      return user;
    } catch (error) {
      throw (error)
    }
  }

  async deleteUser(id: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { name: "string" },
      });
    } catch (error) {
      throw (error)
    }
  }
}

export class UserMiscService {
  async getUserNameByEmail(email: string) {
    try {
      return await (prisma.user.findFirst({ where: { email }, select: { name: true } }) as any).email || "Un-named";
    } catch (error) {
      throw (error)
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
        select: { id: true }, // use lightweight field
      });
      return !!user; // returns true if user found, else false
    } catch (error) {
      throw error;
    }
  }

  async getUserDetailsforToken(email: string) {
    try {
      const user = await prisma.user.findFirst({ where: { email }, select: { id: true, name: true, email: true, phone: true, gender: true, userType: true, freeMeetingRoomSlots: true } });
      if (user) {
        const isAdmin = await superAdminMiscService.isAdmin(user.id);
        return { ...user, userType: isAdmin ? UserType.SUPER_ADMIN : user.userType }
      }
      throw new Error('User not found');
    } catch (error) {
      throw (error)
    }
  }

  async getUserDetailsforOtp(email: string) {
    try {
      return await prisma.user.findFirst({ where: { email }, select: { name: true, id: true } });
    } catch (error) {
      throw (error)
    }
  }

  async getUserCompany(userID: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userID }, include: { company: true } });
      return user?.company;
    } catch (error) {
      throw (error)
    }
  }

  async getAllEmployeesByCompanyId(page: number = 1, limit: number = 10, companyId: string) {
    try {
      const [data, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: { companyId, userType: { in: ["EMPLOYEE"] } },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" }
        }),
        prisma.user.count({ where: { companyId, userType: { in: ["EMPLOYEE"] } } })
      ]);
      const serialNumbers = Array.from({ length: data.length }, (_, i) => (page - 1) * limit + i + 1);
      const users = data.map((user, index) => ({ ...user, serialNumber: serialNumbers[index] }));
      return { users, totalCount };
    } catch (error) {
      throw (error)
    }
  }

  async updateUserAdvanceAmount(data: any) {
    try {
      const user = await prisma.user.update({ where: { id: data.id }, data: { advance: data?.advance || 0.00 } });
      return user;
    } catch (error) {
      throw (error)
    }
  }

  async getUserBasedOnReferralCode(referralCode: string) {
    try {
      const user: any = await prisma.user.findUnique({ where: { referralCode } });
      return user?.id;
    } catch (error) {
      throw (error)
    }
  }

  async getFreeMeetingRoomSlots(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id } }) as User;
      return user.freeMeetingRoomSlots;
    } catch (error) {
      throw (error)
    }
  }

  async getAllActiveUsers() {
    try {
      const activeNonSuperAdminCount = await prisma.user.count({
        where: {
          status: 'ACTIVE',
        },
      });
      return activeNonSuperAdminCount;
    } catch (error) {
      throw (error)
    }
  }

  async getuserTypesPieChartCount() {
    try {
      const superAdmins = await prisma.user.count({
        where: {
          userType: "USER",
          status: 'ACTIVE',
          SuperAdmin: { isNot: null }, // Excludes users who have a related SuperAdmin record
        },
      });
      const individuals = await prisma.user.count({
        where: {
          userType: "USER",
          status: 'ACTIVE',
          SuperAdmin: null, // Excludes users who have a related SuperAdmin record
        },
      });
      const employees = await prisma.user.count({
        where: {
          userType: "EMPLOYEE",
          status: 'ACTIVE',
          SuperAdmin: null, // Excludes users who have a related SuperAdmin record
        },
      });
      const companies = await prisma.user.count({
        where: {
          userType: "USER_ADMIN",
          status: 'ACTIVE',
          SuperAdmin: null, // Excludes users who have a related SuperAdmin record
        },
      });
      return { COMPANIES: companies, INDIVIDUALS: individuals, EMPLOYEES: employees, SUPER_ADMINS: superAdmins };
    } catch (error) {
      throw (error)
    }
  }
}

export const userService = new UserService();
export const userMiscService = new UserMiscService();

