import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';

export class EditCategoryDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  title: string;
}
