import jwt from 'jsonwebtoken';
import 'dotenv/config';

type UserPayload = {
  id: number;
};

const JWT_SECRET = process.env.jwt_secret_key;
if (!JWT_SECRET) {
  throw new Error("Missing jwt_secret_key in environment variables");
}

const generateToken = (user: UserPayload) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

export { generateToken, verifyToken };