import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import UsersService from "modules/users/users.service";
import ds from "orm/orm.config";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import http, { Server } from "http";
import * as util from "../../../helpers/utils";

describe("AuthService", () => {
  let app: Express;
  let usersService: UsersService;
  let authService: AuthService;
  let server: Server;
  const mockCoordinates: string = "51.9666,21.36666";

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();

    usersService = new UsersService();
    authService = new AuthService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".login", () => {
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);

    it("should create access token for existing user", async () => {
      jest.spyOn(util, "getCoordinatesByAddress").mockResolvedValue(mockCoordinates);
      await createUser({ ...loginDto, address: "test-address" });

      const { token } = await authService.login(loginDto);

      expect(token).toBeDefined();
    });

    it("should throw UnprocessableEntityError when user logs in with invalid email", async () => {
      await authService.login({ email: "invalidEmail", password: "pwd" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });

    it("should throw UnprocessableEntityError when user logs in with invalid password", async () => {
      await createUser({ ...loginDto, address: "test-address" });

      await authService.login({ email: loginDto.email, password: "invalidPassword" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });
  });
});
