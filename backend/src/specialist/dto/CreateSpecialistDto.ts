import { IsOptional, IsString, IsArray } from 'class-validator';
export class CreateSpecialistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  photoUrl: string;

  @IsString()
  qualification: string;

  @IsString()
  timeTable: string;

  @IsString()
  beginingDate: string;

  @IsOptional()
  @IsArray()
  categoryIds: number[];
}
