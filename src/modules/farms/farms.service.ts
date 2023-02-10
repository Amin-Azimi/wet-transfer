import { DeepPartial, Repository } from "typeorm";
import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { User } from "modules/users/entities/user.entity";
import { UnprocessableEntityError } from "errors/errors";
import { DistanceDriving, getCoordinatesByAddress, getDrivingDistance } from "helpers/utils";
import { getFarmsQueryDto } from "./dto/get-farms-query.dto";
import { FarmOrders } from "./enums";
import { FarmResponseDto } from "./dto/farm-response.dto";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
  }

  public async createFarm(dto: CreateFarmDto, user: User): Promise<Farm> {
    const { address } = dto;
    const coordinates = await getCoordinatesByAddress(address);

    const distanceDriving: DistanceDriving = await getDrivingDistance(user.coordinates, coordinates);

    const farm: DeepPartial<Farm> = {
      name: dto.name,
      address: dto.address,
      coordinates,
      size: dto.size,
      yield: dto.yield,
      user_id: user.id,
      distance_text: distanceDriving.text,
      distance_value: distanceDriving.value,
    };

    const createdFarm = this.farmsRepository.create(farm);
    const newFarm = await this.farmsRepository.save(createdFarm);
    return newFarm;
  }

  public async deleteFarms(user_id: string): Promise<void> {
    const farms: Farm[] = await this.farmsRepository.findBy({ user_id });
    if (!farms || farms.length === 0) {
      throw new UnprocessableEntityError("There isn't any farm belong to the user");
    }
    await this.farmsRepository.remove(farms);
  }

  public async getFarms(dto: getFarmsQueryDto): Promise<FarmResponseDto[]> {
    const qb = this.farmsRepository
      .createQueryBuilder("farm")
      .select(["name", "address", "distance_text", "owner", "size", "yield"]);
    // outliers (Boolean) (outliers = the yield of a farm is 30% below or above of the average yield of all farms).
    if (dto?.outliers) {
      qb.where(`farm.yield >= (SELECT AVG(yield) * 1.3 FROM farm) OR farm.yield <= (SELECT AVG(yield) * 0.7 FROM farm)`);
    }
    // The user should be able to get list sorted by
    if (dto?.order_by) {
      switch (dto.order_by) {
        case FarmOrders.name:
          qb.orderBy("name", "ASC");
          break;
        case FarmOrders.date:
          qb.orderBy("createdAt", "DESC");
          break;
        case FarmOrders.driving_distance:
          qb.orderBy("distance_value", "DESC");
          break;
      }
    }
    return qb.getRawMany();
  }
}
