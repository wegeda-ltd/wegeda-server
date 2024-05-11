import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  phone_number: string;
  profile_type: string;
  email: string;
  token:string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
    req.currentUser.token = token;
  } catch (error) {}

  next();
};
