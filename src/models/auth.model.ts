import { db } from "../index.ts";

//check if there is any exact existing email
const isDuplicate = async(email : string) => {
    const user = await db.user.findFirst({
        where: {
            email: email,
        }
    });

    return user;
}

//sign up user
const createUser = async(email: string, password: string) => {
    const user = await db.user.create({
        data: {
            email: email,
            password: password,
        }
    });
    return user;
} 

//delete user
const deleteUser = async(email: string, password: string) => {
    const user = await db.user.delete({
        where: {
            email: email,
            password: password,
        }
    });
    return user;
}


export { isDuplicate, createUser, deleteUser};