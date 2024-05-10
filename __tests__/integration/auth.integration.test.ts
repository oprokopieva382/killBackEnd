import { ConnectMongoDB } from "../../src/cloud_DB";
import { dropCollections } from "../../src/testManager/dropCollections";
import { authService } from "../../src/services";
import { user } from "./seeder";
import { emailAdapter } from "../../src/features/adapters";
import { ObjectId } from "mongodb";

describe("auth tests", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterEach(async () => {
    //await dropCollections();
  });

  afterAll(async () => {
    //await dropCollections();
  });

  describe("USER REGISTRATION", () => {
    const registerUser = authService.registerUser;

    emailAdapter.sendEmail = jest
      .fn()
      .mockImplementation((email: string, code: string) => {
        return true;
      });

    it.skip("1- should register user and return status code 204", async () => {
      const result = await registerUser(user);

      expect(result).toEqual({
        _id: expect.any(ObjectId),
        login: user.login,
        email: user.email,
        password: expect.any(String),
        createdAt: expect.any(String),
        emailConfirmation: {
          confirmationCode: expect.any(String),
          expirationDate: expect.any(Date),
          isConfirmed: false,
        },
      });

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });

    it("2- shouldn't register user and if the user with the given email or login already exists return status code 400", async () => {
      await registerUser(user);
      const userToRegister: any = await registerUser(user);

      expect(userToRegister).toBe(false);
    });
  });
});
