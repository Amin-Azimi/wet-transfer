import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FarmOrders } from "../enums";

export class getFarmsQueryDto {
  @IsEnum(FarmOrders)
  @IsOptional()
  public order_by?: FarmOrders;

  @IsBoolean()
  @IsOptional() 
  public outliers?: boolean;
}
