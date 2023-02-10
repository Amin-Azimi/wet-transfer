import { DistanceDriving, getCoordinatesByAddress, getDrivingDistance, hashPassword } from "helpers/utils";
import { User } from "modules/users/entities/user.entity";
import { DeepPartial, MigrationInterface, QueryRunner } from "typeorm";
import { Farm } from "../entities/farm.entity";

export class farmsSampleData1675890790724 implements MigrationInterface {
  private getRandomNumber(maxLimit: number){
    return Math.floor(Math.random() * maxLimit)
  }
  public async up(queryRunner: QueryRunner): Promise<void> {
    //ToDo : we must have several -about 30 - different address of farms
    const farmAddress = "Firskovvej 53 B, 2800 Kongens Lyngby, Denmark";
    const farmCoordinates = `${this.getRandomNumber(55)}.76975769626489,${this.getRandomNumber(12)}.525743683908928`;

    const usersRepository = queryRunner.manager.getRepository(User);

    const farmsRepository = queryRunner.manager.getRepository(Farm);

    const userAddress: string[] = [
      "Tustrupvej, 2720 København, Denmark",
      "Kirkebjerg Allé 41, 2720 København, Denmark",
      "Merløsevej 45, 2700 København, Denmark",
      "Islevholm 4, 2700 København, Denmark",
    ];

    for (let i = 0; i < 4; i++) {
      const user: DeepPartial<User> = {
        email: `mail-${i}@mail.com`,
        address: userAddress[i],
        coordinates: `${this.getRandomNumber(55)}.694630399994,${this.getRandomNumber(12)}.4832723`,
        hashedPassword: await hashPassword("9gS44*LsA*dK"),
      };
      const createdUser = usersRepository.create(user);
      const newUser = await usersRepository.save(createdUser);
      const distanceDriving: DistanceDriving = { text: `${this.getRandomNumber(100)} km`, value: this.getRandomNumber(100) };

      for (let j = 0; j < 30; j++) {
        const farm: Farm = {
          user_id: newUser.id,
          name: `farm-${i}`,
          owner: `farm-${j}@farm.com`,
          address: farmAddress,
          coordinates: farmCoordinates,
          distance_text: distanceDriving.text,
          distance_value: distanceDriving.value,
          size: this.getRandomNumber(10000),
          yield: this.getRandomNumber(10000),
        } as Farm;
        const createdFarm = farmsRepository.create(farm);
        await farmsRepository.save(createdFarm);
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
