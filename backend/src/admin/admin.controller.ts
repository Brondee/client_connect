import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminInfo, EditAdminInfo } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('info')
  getAdminInfo() {
    return this.adminService.getAdminInfo();
  }

  @Post('add')
  addAdminInfo(@Body() dto: AddAdminInfo) {
    return this.adminService.addAdminInfo(dto);
  }

  @Patch('edit')
  editAdminInfo(@Body() dto: EditAdminInfo) {
    return this.adminService.editAdminInfo(dto);
  }
}
