import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/userModel';
const jwtsecret = process.env.JWT_SECRET as string;

export const auth = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // res.cookies.jwt
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Kindly sign in as a user' });
    }

    // const token = authorization.slice(7, authorization.length);
    // verify the token with or without bearer
    let verified = jwt.verify(token, jwtsecret);

    if (!verified) {
      return res
        .status(401)
        .json({ error: "token invalid, you can't access this route" });
    }

    // const { id } = verified as { [key: string]: string };
    // // find user by id;
    // const user = await User.findOne({ where: { id } });

    // if (!user) {
    //   return res
    //     .status(401)
    //     .json({ error: 'Kindly register/sign in as a user' });
    // }

    // if user allow access
    req.user = verified;
    
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: 'User not logged in' });
  }
};
