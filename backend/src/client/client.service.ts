import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  getAllClients() {
    return this.prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  getClientById(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async addNewClient(dto: CreateClientDto) {
    const client = await this.prisma.client.findUnique({
      where: { telegramName: dto.telegramName },
    });
    if (!client) {
      return this.prisma.client.create({
        data: { ...dto },
      });
    }
  }
}
