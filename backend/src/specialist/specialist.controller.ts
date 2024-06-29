import {
  Controller,
  Get,
  Body,
  Post,
  Delete,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { Param, Res, UseInterceptors } from '@nestjs/common/decorators';
import { ParseIntPipe, ParseArrayPipe } from '@nestjs/common/pipes';
import { CreateSpecialistDto, EditSpecialistDto } from './dto';
import { SpecialistService } from './specialist.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('specialist')
export class SpecialistController {
  constructor(private specialistService: SpecialistService) {}

  @Get('all')
  getAllSpecialists() {
    return this.specialistService.getAllSpecialists();
  }

  @Get(':id')
  getSpecialistsById(@Param('id', ParseIntPipe) specialistId: number) {
    return this.specialistService.getSpecialistsById(specialistId);
  }

  @Get('all/:ids')
  getSpecialistsByServiceIds(
    @Param('ids', ParseArrayPipe) serviceIds: number[],
  ) {
    return this.specialistService.getSpecialistsByServiceIds(serviceIds);
  }

  @Get('/img/:imgpath')
  getImage(@Param('imgpath') imagePath: string, @Res() res) {
    return res.sendFile(imagePath, { root: 'uploads' });
  }

  @Post('add')
  addSpecialist(@Body() dto: CreateSpecialistDto) {
    return this.specialistService.addSpecialist(dto);
  }

  @Post('/single/')
  getSpecialistsByName(@Body() dto: { name: string }) {
    return this.specialistService.getSpecialistsByName(dto);
  }

  @Post('cando')
  checkSpecialist(@Body() dto: { name: string; services: string[] }) {
    return this.specialistService.checkSpecialist(dto);
  }

  @Post('upload/:specialistid')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('specialistid', ParseIntPipe) id: number,
  ) {
    const path = file.path.slice(8);
    return this.specialistService.setImageUrl(path, id);
  }

  @Patch('edit')
  editSpecialist(@Body() dto: EditSpecialistDto) {
    return this.specialistService.editSpecialist(dto);
  }

  @Delete('del/:id')
  deleteSpecialist(@Param('id', ParseIntPipe) id: number) {
    return this.specialistService.deleteSpecialist(id);
  }
}
