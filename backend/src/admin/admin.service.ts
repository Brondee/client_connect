import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddAdminInfo, EditAdminInfo } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  getAdminInfo() {
    return this.prisma.adminInfo.findFirst();
  }

  addAdminInfo(dto: AddAdminInfo) {
    return this.prisma.adminInfo.create({
      data: { ...dto },
    });
  }

  async editAdminInfo(dto: EditAdminInfo) {
    let adminInfoDb = null;
    adminInfoDb = await this.prisma.adminInfo.findFirst();
    if (!adminInfoDb) {
      adminInfoDb = await this.prisma.adminInfo.create({
        data: {
          payDate: 'none',
        },
      });
    }
    return this.prisma.adminInfo.update({
      where: {
        id: adminInfoDb.id,
      },
      data: {
        ...dto,
      },
    });
  }
}
