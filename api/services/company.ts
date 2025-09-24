import { prisma } from "../prismaClient";
import axios from 'axios';

export class CompanyService {
    async getCompany(id: string) {
        try {
            const company = await prisma.company.findUnique({
                where: { id },
                include: { account: true }
            });

            if (!company) return null;

            // Add .logoBase64 if logoUrl exists
            if (company.logoUrl) {
                try {
                    // Fetch image from S3
                    const response = await axios.get(company.logoUrl, { responseType: 'arraybuffer' });

                    const contentType = response.headers['content-type'] || 'image/jpeg'; // fallback if header missing
                    const base64Image = Buffer.from(response.data, 'binary').toString('base64');

                    // Add logoBase64 to the company object
                    (company as any).logoBase64 = `data:${contentType};base64,${base64Image}`;
                } catch (fetchError) {
                    console.error("Failed to fetch image from S3:", fetchError);
                }
            } 

            return company;
        } catch (error) {
            throw error;
        }
    }

    async createCompany(data: any) {
        try {
            return await prisma.company.create({ data });
        } catch (error) {
            throw (error)
        }
    }

    async updateCompany(data: any) {
        try {
            return await prisma.company.update({ where: { id: data?.id }, data });
        } catch (error) {
            throw (error)
        }
    }

    async deleteCompany(id: string) {
        try {
            return await prisma.company.delete({ where: { id } });
        } catch (error) {
            throw (error)
        }
    }
}


export class CompanyMiscService {
    async getCompanyByuserId(id: string) {
        try {
            const user = await prisma.user.findUnique({ where: { id }, include: { company: true } });
            return user?.company;
        } catch (error) {
            throw (error)
        }
    }

    async createCompany(data: any) {
        try {
            console.log("create company")
            // return await prisma.company.upsert({ where: { userId: data.userId }, update: data, create: data });
        } catch (error) {
            throw (error)
        }
    }

    async updateCompany(data: any) {
        try {
            return await prisma.company.update({ where: { id: data?.id }, data });
        } catch (error) {
            throw (error)
        }
    }


}

export const companyService = new CompanyService();
export const companyMiscService = new CompanyMiscService();

