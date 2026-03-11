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
      data: {
        ...data,
        isAvailable: true,
      },
    });
  }

  async getMenuById(id: string) {
    return this.prisma.menu.findUnique({
      where: { id },
    });
  }

  // ⭐ update
  async updateMenu(id: string, data: Partial<CreateMenuDto>) {
    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  // ⭐ delete
  async deleteMenu(id: string) {
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}
