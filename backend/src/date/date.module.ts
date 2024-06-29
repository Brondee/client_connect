import { Module } from '@nestjs/common';
import { DateService } from './date.service';
import { DatesController } from './date.controller';

@Module({
  providers: [DateService],
  controllers: [DatesController],
})
export class DatesModule {}
