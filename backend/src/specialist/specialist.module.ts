import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';

@Module({
  providers: [SpecialistService],
  controllers: [SpecialistController]
})
export class SpecialistModule {}
