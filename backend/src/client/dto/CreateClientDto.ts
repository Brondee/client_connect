import { IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  telephoneNumber: string;

  @IsString()
  telegramName: string;

  @IsOptional()
  @IsString()
  chatId?: string;
}
