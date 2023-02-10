import { DistanceDriving } from "helpers/utils";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { FarmResponseDto } from "modules/farms/dto/farm-response.dto";
import { Farm } from "modules/farms/entities/farm.entity";
import { User } from "modules/users/entities/user.entity";

export const mockCreateFarmDto: CreateFarmDto = {
  name: "test farm",
  address: "test address",
  size: 21,
  yield: 22,
  owner: "test@test.com",
};

export const mockUser: User = {
  id: "1",
  coordinates: "21.32,10.32"
} as User;

export const mockFarm: Farm = {
  address: "test-address",
  coordinates: "tets-coordinates",
  id: "1",
  name: "some-name",
  owner: "owner@test.com",
  size: "1",
  yield: "2",
  user_id: mockUser.id,
} as unknown as Farm;

export const farms: FarmResponseDto[] = [
  {
    name: "farm-0",
    address: "Firskovvej 53 B, 2800 Kongens Lyngby, Denmark",
    owner: "farm-4@farm.com",
    size: 9580,
    yield: 303,
    distance_text: "15.2 km",
  },
  {
    name: "farm-0",
    address: "Firskovvej 53 B, 2800 Kongens Lyngby, Denmark",
    owner: "farm-5@farm.com",
    size: 9973,
    yield: 2791,
    distance_text: "15.2 km",
  },
  {
    name: "farm-0",
    address: "Firskovvej 53 B, 2800 Kongens Lyngby, Denmark",
    owner: "farm-7@farm.com",
    size: 3208,
    yield: 8670,
    distance_text: "15.2 km",
  },
] as unknown as FarmResponseDto[];

export const mockCoordinates: string = "51.9666,21.36666";
export const mockDrivingDistance: DistanceDriving = { text: "3 km", value: 3000 }
