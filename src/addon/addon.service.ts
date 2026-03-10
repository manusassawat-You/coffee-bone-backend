import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateAddonDto } from './dtos/create-addon.dto';

@Injectable()
export class AddonService {
  constructor(private readonly prisma: PrismaService) {}
  async getAddons() {
    const addon = await this.prisma.addon.findMany();
    return addon;
  }
  async createAddon(data: CreateAddonDto) {
    return this.prisma.addon.create({
      data,
    });
  }
}
