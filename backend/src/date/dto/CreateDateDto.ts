import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateDateDto {
  @IsString()
  date: string;

  @IsString()
  isWorkingDate: string;

  @IsNumber()
  specialistId: number;
}
