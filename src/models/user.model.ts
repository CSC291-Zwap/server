import { db } from "../index.ts";

const getUserInfo = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        items: {
          include: {
            images: true,
          },
        },
      },
    });
    // console.log("Fetched user info:", user);
    return user;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
};

const updateUserName = async (userId: string, newName: string) => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: newName,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user name:", error);
    throw error;
  }
};

export { updateUserName, getUserInfo };