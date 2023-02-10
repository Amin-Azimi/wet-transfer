import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "config/config";
import { TokenDataDto } from "modules/auth/dto/token-data.dto";
import { TokenRequiredError } from "errors/errors";
import UsersService from "modules/users/users.service";
import RequestWithUser from "helpers/request-user";

const usersService = new UsersService();

async function authMiddleware(request: RequestWithUser, _response: Response, next: NextFunction) {
  if (request.headers?.authorization) {
    const token = request.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, config.JWT_SECRET) as TokenDataDto;
      const user = await usersService.findOneBy({ id: decodedToken.id });
      if (user) {
        request.user = user;
        next();
      } else {
        next(new TokenRequiredError("Invalid user"));
      }
    } catch {
      next(new TokenRequiredError("Invalid token"));
    }
  } else {
    next(new TokenRequiredError("Token required"));
  }
}

export default authMiddleware;
