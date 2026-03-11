import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

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

  @Public()
  @Get(':id')
  getMenuById(@Param('id') id: string) {
    return this.menuService.getMenuById(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  createMenu(@Body() data: CreateMenuDto) {
    return this.menuService.createMenu(data);
  }

  // ⭐ update menu
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateMenu(@Param('id') id: string, @Body() data: Partial<CreateMenuDto>) {
    return this.menuService.updateMenu(id, data);
  }

  // ⭐ delete menu
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}
