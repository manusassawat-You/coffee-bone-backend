import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
}
