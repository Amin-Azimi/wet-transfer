import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import config from "config/config";
import { TokenRequiredError } from "errors/errors";
import authMiddleware from "middlewares/auth.middleware";
// eslint-disable-next-line no-unused-vars
import UsersService from "../../modules/users/users.service";
import { User } from "modules/users/entities/user.entity";
import RequestWithUser from "helpers/request-user";

const findOneBySpy = jest.spyOn(UsersService.prototype, "findOneBy").
mockResolvedValueOnce({ id: 1, email: "test@test.com" } as unknown as User)
.mockResolvedValueOnce(null);

describe("authMiddleware", () => {
  let request: RequestWithUser;
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    request = {} as RequestWithUser;
    response = {} as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next with no arguments if the authorization header is present and the token is valid", async () => {
    // arrange
    const userId = 1;
    const token = jwt.sign({ id: userId }, config.JWT_SECRET);
    request.headers = { authorization: `Bearer ${token}` };
     // act
    await authMiddleware(request, response, next);
    // assert
    expect(findOneBySpy).toBeCalled();
    expect(next).toBeCalledWith();
  });

  it("should call next with TokenRequiredError('Invalid user') if the user NOT found", async () => {
    // assert
    const userId = 1;
    const token = jwt.sign({ id: userId }, config.JWT_SECRET);
    request.headers = { authorization: `Bearer ${token}` };
    //act
    await authMiddleware(request, response, next);
    //assert
    expect(next).toBeCalledWith(new TokenRequiredError("Invalid user"));
  });

  it("should call next with TokenRequiredError('Token required') if the authorization header is not present", async () => {
    // act
    await authMiddleware(request, response, next);
    // assert
    expect(next).toBeCalledWith(new TokenRequiredError("Token required"));
  });

  it("should call next with TokenRequiredError('Invalid token') if the token is invalid", async () => {
    const token = jwt.sign({ id: 0 }, "invalid-secret");
    request.headers = { authorization: `Bearer ${token}` };
    await authMiddleware(request, response, next);
    expect(next).toBeCalledWith(new TokenRequiredError("Invalid token"));
  });
});
