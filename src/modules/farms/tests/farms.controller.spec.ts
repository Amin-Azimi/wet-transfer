import { getFarmsQueryDto } from "../dto/get-farms-query.dto";
import { FarmOrders } from "../enums";
import { FarmsController } from "../farms.controller";
import { FarmsService } from "../farms.service";
import { mockNext, mockReq, mockRes } from "./fixtures/mocks";
import { mockFarm, mockCreateFarmDto, mockUser, farms } from "./fixtures/stubs";

describe("FarmsController", () => {
  let controller: FarmsController;
  let farmsService: FarmsService;

  beforeEach(() => {
    controller = new FarmsController();
    farmsService = controller["farmsService"];    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a farm and return a 201 status code", async () => {
        //arrange
        farmsService.createFarm = jest.fn().mockResolvedValue(mockFarm);

        //act
        await controller.create(mockReq, mockRes, mockNext);

        //assert
        expect(farmsService.createFarm).toBeCalledWith(mockCreateFarmDto, mockUser);
        expect(mockRes.status).toBeCalledWith(201);
        expect(mockRes.send).toBeCalledWith(mockFarm);
        expect(mockNext).not.toBeCalled();
    });

    it("should call next with the error if thrown an error during create a farm", async () => {
        //arrange
        const expectedError = new Error("test error");
        farmsService.createFarm = jest.fn().mockRejectedValue(expectedError);

        //act
        await controller.create(mockReq, mockRes, mockNext);

        //assert
        expect(farmsService.createFarm).toBeCalledWith(mockCreateFarmDto, mockUser);
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.send).not.toBeCalled();
        expect(mockNext).toBeCalledWith(expectedError);
    });
  });
  describe("delete", ()=> {
    it("should delete farms and return a 204 status code", async() => {
      //arrange
      farmsService.deleteFarms = jest.fn().mockResolvedValue(mockFarm);

      //act
      await controller.delete(mockReq, mockRes, mockNext);

      //assert
      expect(farmsService.deleteFarms).toBeCalledWith(mockUser.id);
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockRes.send).toBeCalledWith("Ok");
      expect(mockNext).not.toBeCalled();
    });

    it("should call next with the error if thrown an error during delete farms", async () => {
      //arrange
      const expectedError = new Error("test error");
      farmsService.deleteFarms = jest.fn().mockRejectedValue(expectedError);

      //act
    
      await controller.delete(mockReq, mockRes, mockNext);

      //assert
      expect(farmsService.deleteFarms).toBeCalledWith(mockUser.id);
      expect(mockRes.status).not.toBeCalled();
      expect(mockRes.send).not.toBeCalled();
      expect(mockNext).toBeCalledWith(expectedError);
    });
  });

    describe("get", () => {
      it("should return farms & a 200 status code", async () => {
        //arrange
        farmsService.getFarms = jest.fn().mockResolvedValue(farms);
      const mockGetFarmsQueryDto: getFarmsQueryDto = { order_by: FarmOrders.date, outliers: false };
      mockReq.body = { ...mockGetFarmsQueryDto };

        //act
        await controller.get(mockReq, mockRes, mockNext);

        //assert
        expect(farmsService.getFarms).toBeCalledWith(mockGetFarmsQueryDto);
        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.send).toBeCalledWith(farms);
        expect(mockNext).not.toBeCalled();
      });

      it("should call next with the error if thrown an error during delete farms", async () => {
        //arrange
        const expectedError = new Error("test error");
        farmsService.getFarms = jest.fn().mockRejectedValue(expectedError);

        //act
        await controller.get(mockReq, mockRes, mockNext);

        //assert
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.send).not.toBeCalled();
        expect(mockNext).toBeCalledWith(expectedError);
      });
    });
});
