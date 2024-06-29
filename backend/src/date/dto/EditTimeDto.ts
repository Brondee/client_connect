import { IsInt, IsString, IsOptional, IsArray } from 'class-validator';

export class EditTimeDto {
  @IsString()
  date: string;

  @IsInt()
  specialistId: number;

  @IsOptional()
  @IsArray()
  morningTime: string[];

  @IsOptional()
  @IsArray()
  afternoonTime: string[];

  @IsOptional()
  @IsArray()
  eveningTime: string[];
}
