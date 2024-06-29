import { IsInt, IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditDateDto {
  @IsString()
  date: string;

  @IsInt()
  specialistId: number;

  @IsOptional()
  @IsString()
  isWorkingDate: string;

  @IsOptional()
  @IsBoolean()
  isWorkingDateChanged: boolean;
}
