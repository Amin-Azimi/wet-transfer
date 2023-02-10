import { FarmsService } from "./farms.service";
import { NextFunction, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import RequestWithUser from "helpers/request-user";
import { getFarmsQueryDto } from "./dto/get-farms-query.dto";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const farm = await this.farmsService.createFarm(req.body as CreateFarmDto, req.user);
      res.status(201).send(farm);
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      await this.farmsService.deleteFarms(req.user.id);
      res.status(204).send("Ok");
    } catch (error) {
      next(error);
    }
  }
  public async get(req: RequestWithUser, res: Response, next: NextFunction){
    try {
      const farms = await this.farmsService.getFarms(req.body as getFarmsQueryDto);
      res.status(200).send(farms);
    } catch (error) {
      next(error);
    }
  }
}
