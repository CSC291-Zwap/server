import type { Category } from "../generated/prisma/index.js";
import { db } from "../index.ts"

interface Item {
    prodName : string;
    prodDesc: string;
    price: number;
    pickup: string;
    city: string;
    category: Category;
    userId: string;
    imageUrl: string[];
}

const createItem = async (input: Item) => {
  try {
    const newItem = await db.item.create({
      data: {
        prod_name: input.prodName,
        description: input.prodDesc,
        price: input.price,
        pick_up: input.pickup,
        city: input.city,
        category: input.category || "fashion",
        user: { connect: { id: input.userId } },
        images: input.imageUrl
          ? {
              create: input.imageUrl.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
        user: true,
      },
    });

    return newItem;
  } catch (error) {
    console.error("Failed to create item:", error);
    throw error;
  }
};

export { createItem };