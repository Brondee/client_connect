import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialistModule } from './specialist/specialist.module';
import { DatesModule } from './date/date.module';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { OrderModule } from './order/order.module';
import { GeneralModule } from './general/general.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    PrismaModule,
    SpecialistModule,
    DatesModule,
    CategoryModule,
    ClientModule,
    OrderModule,
    GeneralModule,
    AdminModule,
  ],
})
export class AppModule {}
