import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from '../auth/auth.controller';
import { UserController } from '../user/user.controller';
import { AdminController } from '../admin/admin.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { PrismaService } from 'src/common/database/prisma.service';

@Module({
  imports: [],
  controllers: [AppController,AuthController,UserController,AdminController],
  providers: [AppService,AuthService,UserService,AdminService,PrismaService],
})
export class AppModule {}
