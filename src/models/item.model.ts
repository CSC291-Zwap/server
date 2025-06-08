// Modified backend service to handle imageUrls directly
import type { Category } from "../generated/prisma/index.js";
import { db } from "../index.ts"

interface Item {
    prodName: string;
    prodDesc: string;
    price: number;
    pickup: string;
    city: string;
    category: Category;
    userId: string;
    imageUrls: string[]; // Changed from imageUrl to imageUrls for clarity
}

const createItem = async (input: Item) => {
  try {
    console.log("Creating item with input:", input);
    const newItem = await db.item.create({
      data: {
        prod_name: input.prodName,
        description: input.prodDesc,
        price: input.price,
        pick_up: input.pickup,
        city: input.city,
        category: input.category || "fashion",
        user: { connect: { id: input.userId } },
        images: input.imageUrls && input.imageUrls.length > 0
          ? {
              create: input.imageUrls.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
        user: {
          select: { id: true, name: true, email: true },
        },
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
                user: {
                  select: { id: true, name: true, email: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        console.log("Fetched items:", items[1].images);
        return items;
    } catch (error) {
        console.error("Failed to get all items:", error);
        throw error;
    }
}

const getItemById = async (id: string) => {
    try {
        const item = await db.item.findUnique({
            where: { id },
            include: {
                images: true,
                user: {
                  select: { id: true, name: true, email: true },
                },
            },
        });

        return item;
    } catch (error) {
        console.error("Failed to get item by id:", error);
        throw error;
    }
}

const getItemsByUserId = async (userId: string) => {
    try {
        const items = await db.item.findMany({
            where: { userId },
            include: {
                images: true,
                user: {
                  select: { id: true, name: true, email: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return items;
    } catch (error) {
        console.error("Failed to get items by user id:", error);
        throw error;
    }
}

const deleteItembyId = async (id: string) => {
  try {
    // First get the item to retrieve image URLs for Firebase cleanup
    const item = await db.item.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!item) {
      throw new Error("Item not found");
    }

    // Delete associated images first
    await db.image.deleteMany({
      where: {
        itemId: id,
      },
    });

    // Delete the item
    const deletedItem = await db.item.delete({
      where: {
        id,
      },
    });

    // Return the deleted item along with image URLs for Firebase cleanup
    return {
      ...deletedItem,
      imageUrls: item.images.map(img => img.url),
    };
  } catch (error) {
    console.error("Failed to delete item:", error);
    throw error;
  }
};

const updateItem = async (id: string, input: Partial<Item>) => {
  try {
    // Get current item to potentially clean up old images
    const currentItem = await db.item.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!currentItem) {
      throw new Error("Item not found");
    }

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

    // Handle image updates if provided
    if (input.imageUrls && input.imageUrls.length > 0) {
      // Delete existing images
      await db.image.deleteMany({
        where: {
          itemId: id,
        },
      });

      // Create new images
      await db.image.createMany({
        data: input.imageUrls.map((url) => ({
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

    return {
      ...result,
      oldImageUrls: currentItem.images.map(img => img.url), // For Firebase cleanup
    };
  } catch (error) {
    console.error("Failed to update item:", error);
    throw error;
  }
};

export { createItem, getItemAll, getItemById, getItemsByUserId, updateItem, deleteItembyId };