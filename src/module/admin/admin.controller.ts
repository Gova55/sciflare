import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createAdminDto: CreateAdminDto, @Req() req: any) {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    const result = await this.adminService.create(createAdminDto, userId);
    return {
      status: true,
      data: result,
      message: 'Admin created successfully',
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Req() req: any,
  ) {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    console.log('user', userId);

    const admin = await this.adminService.findAll(page, search, userId);
    return {
      status: true,
      data: admin,
      message: 'Admin Fetched successfully',
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const updateAdmin = await this.adminService.update(+id, updateAdminDto);
    return {
      status: true,
      data: updateAdmin,
      message: 'Admin updated successfully',
    };
  }

  @Patch('/delete/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    await this.adminService.remove(+id);
    return { message: 'Admin deleted successfully' };
  }
}
