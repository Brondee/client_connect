import { IsOptional, IsString } from 'class-validator';

export class EditGeneralInfo {
  @IsOptional()
  @IsString()
  companyTelephone: string;

  @IsOptional()
  @IsString()
  companyAddress: string;

  @IsOptional()
  @IsString()
  companyDescription: string;
}
