import { prisma } from "../prismaClient";

class ServiceCategoryService {

  async getAllServiceCategories() {
    try {
      const DURATION_ORDER = ['HOUR', 'DAY', 'MONTH', 'YEAR'];

      const categories = await prisma.serviceCategory.findMany({
        include: {
          services: {
            include: {
              plans: {
                include: { service: true },
                orderBy: { defaultValue: 'asc' },
              },
            },
          },
        },
      });

      // Custom sort after fetching
      for (const category of categories) {
        for (const service of category.services) {
          service.plans.sort((a, b) => {
            const defaultValueCompare = a.defaultValue - b.defaultValue;
            if (defaultValueCompare !== 0) return defaultValueCompare;

            // If defaultValue is the same, sort by custom duration order
            return (
              DURATION_ORDER.indexOf(a.duration) - DURATION_ORDER.indexOf(b.duration)
            );
          });
        }
      }
      return categories;
    } catch (error) {
      throw (error)
    }
  }

}


export const serviceCategory = new ServiceCategoryService();

