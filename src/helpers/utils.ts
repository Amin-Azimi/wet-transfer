import { DataSource } from "typeorm";
import { readdir } from "node:fs/promises";
import config from "config/config";
import fetch from "node-fetch";
import * as bcrypt from "bcrypt";

export interface DistanceDriving {
  text: string;
  value: number;
}
export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

export const transformArrayToNumberAndString = (arr: string[]): Promise<(string | number)[]> => {
  return new Promise<(string | number)[]>(resolve =>
    resolve(arr.map((value: string) => (isNaN(value as unknown as number) ? value : Number(value)))),
  );
};

export const getAllCSVFiles = async (): Promise<string[]> => {
  return (await readdir("./files")).filter(file => file.endsWith(".csv"));
};

export const containsDigit = (str: string): boolean => /\d/.test(str);

export const getCoordinatesByAddress = async (address: string): Promise<string> => {
  const coordinatesApiUrl = `https://api.distancematrix.ai/maps/api/geocode/json?address=${address}&key=${config.API_TOKEN}`;
  const response = await fetch(coordinatesApiUrl);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const body = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return `${body.result[0].geometry.location.lat},${body.result[0].geometry.location.lng}`;
};

export async function hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
  const salt = await bcrypt.genSalt(salt_rounds);
  return bcrypt.hash(password, salt);
}

export const getDrivingDistance = async (origin: string, destination: string): Promise<DistanceDriving> => {
  const distanceApiUrl = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&departure_time=now&key=${config.API_TOKEN}`;
  const response = await fetch(distanceApiUrl);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const body = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    text: body.rows[0].elements[0].distance.text as string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    value: body.rows[0].elements[0].distance.value as number,
  };
};
