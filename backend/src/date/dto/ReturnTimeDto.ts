import { IsString } from 'class-validator';

export class ReturnTimeDto {
  @IsString()
  orderId: string;

  @IsString()
  totalTime: string;
}
