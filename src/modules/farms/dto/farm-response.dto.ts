import { Expose } from "class-transformer";
import { MaxLength, IsString, IsNotEmpty, IsEmail, IsNumber, IsPositive } from "class-validator";

export class FarmResponseDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @Expose()
  public name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @Expose()
  public address: string;

  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  public owner: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  public size: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  public yield: number;

  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  @Expose()
  public distance_text: number;
}
