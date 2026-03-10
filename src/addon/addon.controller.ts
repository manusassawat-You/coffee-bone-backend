import { Body, Controller, Get, Post } from '@nestjs/common';

import { AddonService } from './addon.service';
import { CreateAddonDto } from './dtos/create-addon.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('addon')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}
  @Public()
  @Get()
  async getAddons() {
    return this.addonService.getAddons();
  }
  @Post()
  async createAddon(@Body() data: CreateAddonDto) {
    return this.addonService.createAddon(data);
  }
}
