import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientName: string;

  @IsString()
  clientTelegram: string;

  @IsString()
  clientTelephone: string;

  @IsString()
  clientComment: string;

  @IsOptional()
  @IsString()
  clientChatId: string;

  @IsInt()
  masterId: number;

  @IsString()
  masterName: string;

  @IsInt()
  totalTime: number;

  @IsString()
  dateTime: string;

  @IsString()
  servicesInfo: string;

  @IsInt()
  totalPrice: number;

  @IsInt()
  servicesCount: number;
}
