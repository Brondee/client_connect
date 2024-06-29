import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
export class EditServiceDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  price: number;

  @IsOptional()
  @IsInt()
  priceSecond: number;

  @IsOptional()
  @IsString()
  time: string;

  @IsOptional()
  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsArray()
  specialistsIds?: number[];
}
