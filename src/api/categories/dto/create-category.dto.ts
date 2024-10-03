import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

export class CreateCategoryDto {
  @IsString()
  @Transform(({ value }) => sanitize(value))
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitize(value))
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  parentCategoryId?: number;
}
