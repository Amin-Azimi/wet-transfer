import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import UsersService from "./users.service";
import { UserDto } from "../auth/dto/user.dto";
import { containsDigit, getAllCSVFiles } from "helpers/utils";
import { FarmsService } from "modules/farms/farms.service";
import { FarmOrders } from "modules/farms/enums";

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUser(req.body as CreateUserDto);
      res.status(201).send(UserDto.createFromEntity(user));
    } catch (error) {
      next(error);
    }
  }
  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(id, await getAllCSVFiles());
      console.log(id, containsDigit("test-string"));
      console.log(id, containsDigit("test-string123"));

      res.status(201).send(await new FarmsService().getFarms({outliers: true, order_by: FarmOrders.driving_distance }));
    } catch (error) {
      console.log("error::", error);
      next(error);
    }
  }
}


