import { IsString } from 'class-validator';

export class EditOrderDto {
  @IsString()
  orderId: string;

  @IsString()
  clientChatId: string;
}
