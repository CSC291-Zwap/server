import { db } from "../index.ts";

const getOrdersByUserId = async (userId: string) => {
  try {
    const buyerOrders = await db.order.findMany({
      where: { buyerId: userId },
      include: {
        item: {
          include: { images: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { orderTime: "desc" },
    });

    const sellerOrders = await db.order.findMany({
      where: { sellerId: userId },
      include: {
        item: {
          include: { images: true },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { orderTime: "desc" },
    });

    return { buyerOrders, sellerOrders };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

const createOrder = async (itemId: string, buyerId: string) => {
  try {
    const item = await db.item.findUnique({
      where: { id: itemId },
      select: { userId: true, status: true },
    });

    if (!item) throw new Error("Item not found.");
    if (item.status === "sold") throw new Error("Item is already sold.");

    const newOrder = await db.order.create({
      data: {
        itemId,
        buyerId,
        sellerId: item.userId,
      },
      include: {
        item: true,
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    await db.item.update({
      where: { id: itemId },
      data: { status: "sold" },
    });

    return newOrder;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export { getOrdersByUserId, createOrder };