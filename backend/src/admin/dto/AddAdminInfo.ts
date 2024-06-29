import { IsOptional, IsString } from 'class-validator';

export class AddAdminInfo {
  @IsOptional()
  @IsString()
  BotPaid: string;

  @IsString()
  payDate: string;
}
