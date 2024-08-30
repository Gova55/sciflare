import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createNewUser(@Body() userDetail: CreateUserDto, @Req() req: any) {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    const result = await this.userService.createNewUser(userDetail, userId);
    return { data: result, message: 'User created successfully' };
  }

  @Get('')
  @UseGuards(AuthGuard)
  async findAllUser(
    @Query('search') search: string,
    @Query('page') page: number,
    @Req() req: any,
  ) {
    const userId = req.adminId;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }

    const result = await this.userService.findAllUsers(page, search, userId);
    return {
      data: result,
      message: 'Users fetched successfully',
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() alterUserDetails: UpdateUserDto,
  ) {
    await this.userService.editUser(id, alterUserDetails);

    return {
      message: 'User details edited successfully',
    };
  }
}