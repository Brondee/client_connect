import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { GeneralService } from './general.service';
import { CreateGeneralInfo, EditGeneralInfo } from './dto';

@Controller('general')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get('info')
  getGeneralInfo() {
    return this.generalService.getInfo();
  }

  @Post('add')
  addGeneralInfo(@Body() dto: CreateGeneralInfo) {
    return this.generalService.addGeneralInfo(dto);
  }

  @Patch('edit')
  editGeneralInfo(@Body() dto: EditGeneralInfo) {
    return this.generalService.editInfo(dto);
  }
}
