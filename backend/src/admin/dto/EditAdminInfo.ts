import { IsOptional, IsString } from 'class-validator';

export class EditAdminInfo {
  @IsOptional()
  @IsString()
  BotPaid: string;

  @IsOptional()
  @IsString()
  payDate: string;
}
