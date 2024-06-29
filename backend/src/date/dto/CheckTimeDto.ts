import { IsString } from 'class-validator';

export class CheckTimeDto {
  @IsString()
  date: string;

  @IsString()
  specialistName: string;

  @IsString()
  time: string;
}
