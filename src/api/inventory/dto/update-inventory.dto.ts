import { IsEnum, IsInt, Min, IsString, IsOptional } from 'class-validator';
import { ChangeType } from '@prisma/client';

export class AdjustInventoryDto {
  @IsEnum(ChangeType)
  changeType: ChangeType;

  @IsInt()
  @Min(1)
  quantityChanged: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
