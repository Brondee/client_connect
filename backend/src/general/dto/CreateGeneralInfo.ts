import { IsString } from 'class-validator';

export class CreateGeneralInfo {
  @IsString()
  companyTelephone: string;

  @IsString()
  companyAddress: string;

  @IsString()
  companyDescription: string;
}
