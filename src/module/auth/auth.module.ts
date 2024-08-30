import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/database/prisma.service';

@Module({
  exports: [AuthModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}