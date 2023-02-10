import { UnprocessableEntityError } from "errors/errors";
import { DeepPartial, Repository } from "typeorm";
import { getFarmsQueryDto } from "../dto/get-farms-query.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { farms, mockCoordinates, mockCreateFarmDto, mockDrivingDistance, mockFarm, mockUser } from "./fixtures/stubs";
import * as util from "../../../helpers/utils";
import { mockFarmCreateQueryBuilder } from "./fixtures/mocks";
import { FarmOrders } from "../enums";

describe("FarmsService", () => {
  let service: FarmsService;
  let repository: Repository<Farm>;

  beforeEach(() => {
    service = new FarmsService();
    repository = service["farmsRepository"];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createFarm", () => {
    it("should create and return a farm", async () => {
      //arrange
      const farm: DeepPartial<Farm> = {
        name: mockCreateFarmDto.name,
        address: mockCreateFarmDto.address,
        coordinates: mockCoordinates,
        size: mockCreateFarmDto.size,
        yield: mockCreateFarmDto.yield,
        distance_text: mockDrivingDistance.text,
        distance_value: mockDrivingDistance.value,
        user_id: mockUser.id,
      };
      const coordinatesSpy = jest.spyOn(util, "getCoordinatesByAddress").mockResolvedValue(mockCoordinates);
      const drivingDistanceSpy = jest.spyOn(util, "getDrivingDistance").mockResolvedValue(mockDrivingDistance);
      const createSpy = jest.spyOn(repository, "create").mockReturnValue(mockFarm);
      const saveSpy = jest.spyOn(repository, "save").mockResolvedValue(mockFarm);

      //act
      const result = await service.createFarm(mockCreateFarmDto, mockUser);

      //assert
      expect(result).toEqual(mockFarm);
      expect(coordinatesSpy).toBeCalledWith(mockCreateFarmDto.address);
      expect(drivingDistanceSpy).toBeCalledWith(mockUser.coordinates, mockCoordinates);
      expect(createSpy).toBeCalledWith(farm);
      expect(saveSpy).toBeCalledWith(mockFarm);
    });
  });

  describe("deleteFarms", () => {
    it("should delete farm", async () => {
      // arrange
      const findBySpy = jest.spyOn(repository, "findBy").mockResolvedValue([mockFarm]);
      const removeSpy = jest.spyOn(repository, "remove").mockResolvedValue(mockFarm);

      // act && assert
      await expect(service.deleteFarms("1")).resolves.toBeUndefined();
      expect(findBySpy).toBeCalledWith({ user_id: "1" });
      expect(removeSpy).toBeCalledWith([mockFarm]);
    });
    it("should throw an error if does NOT find any farm", async () => {
      // arrange
      const removeSpy = jest.spyOn(repository, "remove").mockResolvedValue(mockFarm);
      const findBySpy = jest.spyOn(repository, "findBy").mockResolvedValue([]);

      // act & assert
      await expect(service.deleteFarms("1")).rejects.toThrow(
        new UnprocessableEntityError("There isn't any farm belong to the user"),
      );
      expect(findBySpy).toBeCalledWith({ user_id: "1" });
      expect(removeSpy).not.toBeCalled();
    });
  });

  describe("getFarms", () => {
    it("should filter the yield of a farm is 30% below or above of the average yield of all farms) if outliers=== TRUE", async () => {
      // arrange
      const queryBuilderSpy = jest.spyOn(repository, "createQueryBuilder").mockReturnValue(mockFarmCreateQueryBuilder);
      const dto: getFarmsQueryDto = { outliers: true };

      // act & assert
      await expect(service.getFarms(dto)).resolves.toEqual(farms);
      expect(queryBuilderSpy).toBeCalledWith("farm");
      expect(mockFarmCreateQueryBuilder.select).toBeCalledWith(["name", "address", "distance_text", "owner", "size", "yield"]);
      expect(mockFarmCreateQueryBuilder.where).toBeCalledWith(
        `farm.yield >= (SELECT AVG(yield) * 1.3 FROM farm) OR farm.yield <= (SELECT AVG(yield) * 0.7 FROM farm)`,
      );
      expect(mockFarmCreateQueryBuilder.getRawMany).toBeCalledWith();
    });
    it("should sort by order_by field", async() => {
      // arrange
      jest.spyOn(repository, "createQueryBuilder").mockReturnValue(mockFarmCreateQueryBuilder);
      const dto: getFarmsQueryDto = { outliers: true, order_by: FarmOrders.date };

      const result = await service.getFarms(dto); 
      // act & assert
      expect(result).toEqual(farms);
      expect(mockFarmCreateQueryBuilder.orderBy).toBeCalledWith("createdAt", "DESC");
    });
  });
});
