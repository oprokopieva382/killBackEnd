import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helper/api-errors";
import { jwtService, userQueryRepository } from "../composition-root";

export const isAuthorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Access token is incorrect or expired",
      ]);
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByAccessToken(token);

    if (!userId) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Access token is incorrect or expired",
      ]);
    }

    //getting authorizedUser from cache or DB
    const authorizedUser = await userQueryRepository.getByIdUser(userId);
    if (!authorizedUser) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
};
