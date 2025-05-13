import type { Context } from "hono";
import * as authModel from "../models/auth.model.ts";
import { hash, compare } from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt.utils.ts';

type createUserBody = {
  email: string;
  password: string;
};

const signup = async (c: Context) => {
  try {
    const body = await c.req.json<createUserBody>();

    const hashedPassword = await hash(body.password, 10);

    //check if one of them is missing
    if (!body.email || !body.password) {
        return c.json(
            {
                success: false,
                data: null,
                msg: "Missing required fields.",
            },
            400
        );
    }

    //check if there is any duplicate
    if (await authModel.isDuplicate(body.email)) {
        return c.json(
            {
                success: false,
                data: null, 
                msg: "Existing user detected with the same email."
            }
        );
    }

    //if above conditions aren't met, create the user
    const newUser = await authModel.createUser(
        body.email,
        hashedPassword,
    );

    const token = generateToken(newUser);

    return c.json({
        success: true,
        data: {
          newUser,
          token,
        }, 
        msg: "Created new User!"
    });

  } catch (e) {
    return c.json({
      success: false,
      data: null,
      msg: `${e}`,
    });
  }
};

const login = async (c: Context) => {
  try {
     const body = await c.req.json<createUserBody>();
    //check missing fields
    if (!body.email || !body.password) {
        return c.json(
            {
                success: false,
                data: null,
                msg: "Missing required fields.",
            },
            400
        );
    }

    //searching user
    const user = await authModel.isDuplicate(body.email);

    //if user not found
    if(!user) {
      return c.json(
        {
          success: false,
          data: null,
          msg: "User not found!"
        }, 404
      );
    }

    //checking entered password
    const isMatch = await compare(body.password, user.password);

    if (!isMatch) {
      return c.json({
        success: false,
        data: null,
        msg: "Incorrect Password."
      }, 401);
    }

     const token = generateToken({ id: user.id });

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        token,
      },
      msg: "Login successful.",
    });


  } catch (e) {
    return c.json({
      success: false,
      data: null,
      msg: `${e}`,
    });
  }
}

export { signup, login };
