import { Farm } from "modules/farms/entities/farm.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { farms, mockCreateFarmDto, mockFarm, mockUser } from "./stubs";
import { Response } from "express";
import RequestWithUser from "helpers/request-user";


export const mockFarmsRepository: Repository<Farm> = {
  create: jest.fn().mockResolvedValue(mockFarm),
  save: jest.fn().mockResolvedValue(mockFarm),
} as unknown as Repository<Farm>;


export const mockReq: RequestWithUser = { body: mockCreateFarmDto, user: mockUser } as RequestWithUser;

export const mockRes: Response = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;

export const mockNext = jest.fn();

export const mockFarmCreateQueryBuilder: SelectQueryBuilder<Farm> = {
  orderBy: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue(farms),
  createQueryBuilder: jest.fn().mockReturnThis(),
} as unknown as SelectQueryBuilder<Farm>;

