import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { EditOrderDto } from './dto/EditOrderDto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  getAllOrders(offset: number) {
    return this.prisma.order.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: offset,
      take: 10,
    });
  }

  async getOrdersByUsername(username: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        clientTelegram: username,
      },
    });
    const today = new Date();
    let date = String(today.getDate());
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    if (date.length === 1) {
      date = '0' + date;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const fullDate = year + '-' + month + '-' + date;
    return orders
      .map((order) => {
        const { dateTime } = order;
        const dateStr = dateTime.split(',')[0];
        if (Date.parse(fullDate) <= Date.parse(dateStr)) {
          return order;
        } else {
          return null;
        }
      })
      .filter((order) => order !== null);
  }

  async getOrdersByChatId(chatId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        clientChatId: chatId,
      },
    });
    const today = new Date();
    let date = String(today.getDate());
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    if (date.length === 1) {
      date = '0' + date;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const fullDate = year + '-' + month + '-' + date;
    return orders
      .map((order) => {
        const { dateTime } = order;
        const dateStr = dateTime.split(',')[0];
        if (Date.parse(fullDate) <= Date.parse(dateStr)) {
          return order;
        } else {
          return null;
        }
      })
      .filter((order) => order !== null);
  }

  getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  getTodayOrders(offset: number) {
    const today = new Date();
    let date = String(today.getDate());
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    if (date.length === 1) {
      date = '0' + date;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const fullDate = year + '-' + month + '-' + date;
    return this.prisma.order.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        dateTime: {
          contains: fullDate,
        },
      },
      skip: offset,
      take: 10,
    });
  }

  getTomorrowOrders() {
    const today = new Date();
    let date = String(today.getDate() + 1);
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    if (date.length === 1) {
      date = '0' + date;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const fullDate = year + '-' + month + '-' + date;
    return this.prisma.order.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        dateTime: {
          contains: fullDate,
        },
      },
    });
  }

  addOrder(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: { ...dto },
    });
  }

  setChatId(dto: EditOrderDto) {
    const id = Number(dto.orderId);
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        clientChatId: dto.clientChatId,
      },
    });
  }

  deleteOrderById(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
