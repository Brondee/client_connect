import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGeneralInfo, EditGeneralInfo } from './dto';

@Injectable()
export class GeneralService {
  constructor(private prisma: PrismaService) {}

  getInfo() {
    return this.prisma.general.findFirst();
  }

  addGeneralInfo(dto: CreateGeneralInfo) {
    return this.prisma.general.create({
      data: { ...dto },
    });
  }

  async editInfo(dto: EditGeneralInfo) {
    let generalInfo = null;
    generalInfo = await this.prisma.general.findFirst();
    if (!generalInfo) {
      generalInfo = await this.prisma.general.create({
        data: {
          companyTelephone: '',
          companyAddress: '',
          companyDescription: '',
        },
      });
    }
    return this.prisma.general.update({
      where: { id: generalInfo.id },
      data: { ...dto },
    });
  }
}
