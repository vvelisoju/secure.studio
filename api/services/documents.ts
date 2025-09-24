import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const documentService = {
  async createDocument(data: any) {
    return await prisma.document.create({ data });
  },

  async getDocumentById(id: string) {
    return await prisma.document.findUnique({ where: { id }, include: { signatures: true } });
  },

  async getDocumentsByUser(userId: string) {
    return await prisma.document.findMany({ where: { userId }, include: { signatures: true } });
  },

  async updateDocument(id: string, data: any) {
    return await prisma.document.update({ where: { id }, data });
  },

  async deleteDocument(id: string) {
    return await prisma.document.delete({ where: { id } });
  },

  async createSignature(data: any) {
    return await prisma.signature.create({ data });
  },

  async signDocument(id: string, { signatureUrl }: { signatureUrl: string }) {
    return await prisma.signature.update({
      where: { id },
      data: { signatureUrl, status: "SIGNED", signedAt: new Date() },
    });
  },
};
