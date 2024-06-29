import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('all')
  getAllClients() {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  getClientById(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.getClientById(id);
  }

  @Post('add')
  addNewClient(@Body() dto: CreateClientDto) {
    return this.clientService.addNewClient(dto);
  }
}
