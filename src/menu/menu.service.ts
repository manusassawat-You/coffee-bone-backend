import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMenuDto } from './dtos/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenus() {
    return this.prisma.menu.findMany({
      where: {
        isAvailable: true,
      },
    });
  }
  async createMenu(data: CreateMenuDto) {
    return this.prisma.menu.create({
      data: { ...data, isAvailable: true },
    });
  }
}
