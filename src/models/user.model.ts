import { db } from "../index.ts";

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

export { updateUserName };