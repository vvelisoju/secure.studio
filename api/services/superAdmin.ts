import { prisma } from "../prismaClient";

class SuperAdminService {
    async getAllAdmins() {
        try {
            return await prisma.superAdmin.findMany({ select: { user: { select: { email: true, id: true } } } });
        } catch (error) {
            throw (error)
        }
    }
}

class SuperAdminMiscService {
    async isAdmin(userId: any) {
        try {
            const response = await prisma.superAdmin.findUnique({ where: { userId } });
            return !!response;
        } catch (error) {
            throw (error)
        }
    }
}
export const superAdminService = new SuperAdminService();
export const superAdminMiscService = new SuperAdminMiscService();