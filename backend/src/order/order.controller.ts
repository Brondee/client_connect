import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';
import { EditOrderDto } from './dto/EditOrderDto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('all/:offset')
  getAllOrders(@Param('offset', ParseIntPipe) offset: number) {
    return this.orderService.getAllOrders(offset);
  }

  @Get('tg/:username')
  getOrdersByUsername(@Param('username') username: string) {
    return this.orderService.getOrdersByUsername(username);
  }

  @Get('chat/:chatId')
  getOrdersByChatId(@Param('chatId') chatId: string) {
    return this.orderService.getOrdersByChatId(chatId);
  }

  @Get('today/:offset')
  getTodayOrders(@Param('offset', ParseIntPipe) offset: number) {
    return this.orderService.getTodayOrders(offset);
  }

  @Get('tomorrow')
  getTomorrowOrders() {
    return this.orderService.getTomorrowOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Post('add')
  addOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.addOrder(dto);
  }

  @Patch('edit')
  setChatId(@Body() dto: EditOrderDto) {
    return this.orderService.setChatId(dto);
  }

  @Delete('del/:id')
  deleteOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrderById(id);
  }
}
