import { prisma } from "../prismaClient";

class Service {

    async updateService(data: any) {
        try {
            return await prisma.service.update({ where: { id: data.id }, data })
        } catch (error) {
            throw (error)
        }
    }

}

class ServiceMisc {
    async getTimeSlotsById(data: any) {
        try {
            const response = await prisma.service.findUnique({
                where: { id: data?.serviceId },
            })
            return response
        } catch (error) {
            throw (error)
        }
    }

}

export const service = new Service();
export const serviceMisc = new ServiceMisc();