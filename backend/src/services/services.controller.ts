import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { CreateServiceDto, EditServiceDto } from './dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get('all')
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get(':ids')
  getServicesByIds(@Param('ids', ParseArrayPipe) ids: number[]) {
    return this.servicesService.getServicesByIds(ids);
  }

  @Get('all/:id')
  getServicesByCategoryId(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.getServicesByCategoryId(id);
  }

  @Post('title')
  getServiceByTitle(@Body() dto: { title: string }) {
    return this.servicesService.getServiceByTitle(dto);
  }

  @Post('add')
  addNewService(@Body() dto: CreateServiceDto) {
    return this.servicesService.addNewService(dto);
  }

  @Patch('edit')
  editService(@Body() dto: EditServiceDto) {
    return this.servicesService.editService(dto);
  }

  @Delete('del/:id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.deleteService(id);
  }
}
