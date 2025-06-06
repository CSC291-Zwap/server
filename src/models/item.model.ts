import { Category } from "../generated/prisma/index.js";
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

const getItemAll = async () => {
    try {
        const items = await db.item.findMany({
            include: {
                images: true,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return items;
    } catch (error) {
        console.error("Failed to get all items:", error);
        throw error;
    }
}

const deleteItembyId = async (id: string) => {
  try {
    await db.image.deleteMany({
      where: {
        itemId: id,
      },
    });

    const deletedItem = await db.item.delete({
      where: {
        id,
      },
    });

    return deletedItem;
  } catch (error) {
    console.error("Failed to delete item:", error);
    throw error;
  }
};

const updateItem = async (id: string, input: Partial<Item>) => {
  try {
    const updatedItem = await db.item.update({
      where: { id },
      data: {
        prod_name: input.prodName,
        description: input.prodDesc,
        price: input.price,
        pick_up: input.pickup,
        city: input.city,
        category: input.category,
      },
    });

    if (input.imageUrl && input.imageUrl.length > 0) {
      await db.image.deleteMany({
        where: {
          itemId: id,
        },
      });

      await db.image.createMany({
        data: input.imageUrl.map((url) => ({
          url,
          itemId: id,
        })),
      });
    }

    const result = await db.item.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Failed to update item:", error);
    throw error;
  }
};             

const getCategory = async () => {
  try {
    return Object.values(Category);
  }catch (error) {
    console.error("Failed to get categories:", error);
    throw error;
  }
}

export { createItem, getItemAll, updateItem, deleteItembyId, getCategory };