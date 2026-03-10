import { Body, Controller, Get, Post } from '@nestjs/common';

import { AddonService } from './addon.service';
import { CreateAddonDto } from './dtos/create-addon.dto';

@Controller('addon')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}
  @Get()
  async getAddons() {
    return this.addonService.getAddons();
  }
  @Post()
  async createAddon(@Body() data: CreateAddonDto) {
    return this.addonService.createAddon(data);
  }
}
