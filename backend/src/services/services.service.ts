import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto, EditServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  getAllServices() {
    return this.prisma.service.findMany({
      include: {
        category: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  getServicesByIds(ids: number[]) {
    ids = ids.map((id) => Number(id));
    return this.prisma.service.findMany({
      where: {
        id: { in: ids },
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  getServicesByCategoryId(id: number) {
    return this.prisma.service.findMany({
      where: {
        categoryId: id,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  getServiceByTitle(dto: { title: string }) {
    return this.prisma.service.findFirst({
      where: { title: dto.title },
    });
  }

  async addNewService(dto: CreateServiceDto) {
    const newService = await this.prisma.service.create({
      data: {
        ...dto,
      },
    });
    return { newService };
  }

  editService(dto: EditServiceDto) {
    return this.prisma.service.update({
      where: {
        id: dto.id,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteService(id: number) {
    return this.prisma.service.delete({
      where: {
        id,
      },
    });
  }
}
