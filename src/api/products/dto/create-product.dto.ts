import {
    IsString,
    IsOptional,
    IsNumber,
    IsPositive,
    IsInt,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateProductDto {
    @IsString()
    name: string;
  
    @IsString()
    sku: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNumber()
    @IsPositive()
    price: number;
  
    @IsInt()
    categoryId: number;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  }
  