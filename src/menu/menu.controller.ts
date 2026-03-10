import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dtos/create-menu.dto';

import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/database/generated/prisma/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}
  @Public()
  @Get()
  getMenus() {
    return this.menuService.getMenus();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  createMenu(@Body() data: CreateMenuDto) {
    console.log(data, 'createMenu');
    return this.menuService.createMenu(data);
  }
}
