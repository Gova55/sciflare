import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
  } from '@nestjs/common';
  import { verify } from 'jsonwebtoken';
  import { Config } from '../config/config';
  import { PrismaService } from '../database/prisma.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];
  
        if (token) {
          const verificationResponse: any = verify(token, Config.JWT_SECRET_KEY);
  
          if (verificationResponse) {
            const existingToken = await this.prismaService.user.findFirst({
              where: {
                id: +verificationResponse?.userId,
                isActive: true,
              },
            });
  
            if (existingToken.token == token) {
              req.userId = existingToken.id;
              req.adminId = existingToken.adminId;
  
              console.log('data', req.adminId);
  
              const user = await this.prismaService.user.findFirst({
                where: {
                  id: +verificationResponse?.userId,
                  isActive: true,
                },
              });
  
              if (user) {
                return true;
              }
            }
  
            return false;
          } else {
            throw new HttpException('Wrong authentication token', 401);
          }
        } else {
          throw new HttpException('Authentication token missing', 401);
        }
      } catch (error) {
        throw new HttpException('Error: ' + error.message, 401);
      }
    }
  }
  