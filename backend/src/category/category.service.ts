import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        specialists: {
          select: {
            specialistId: true,
          },
        },
      },
    });
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
      },
    });
  }

  editCategory(dto: EditCategoryDto) {
    return this.prisma.category.update({
      where: {
        id: dto.id,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
