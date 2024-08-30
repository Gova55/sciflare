import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common/utility/utility';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto, userId: number) {
    try {
      const hash = await bcrypt.hash(createAdminDto.password, 10);

      const uniqueEmail = await this.prisma.user.findFirst({
        where: { email: createAdminDto.email },
      });
      if (uniqueEmail) {
        throw new BadRequestException('Email already exists');
      }

      const uniqueMobile = await this.prisma.user.findFirst({
        where: { phoneNumber: createAdminDto.phoneNumber },
      });
      if (uniqueMobile) {
        throw new BadRequestException('Mobile number already exists');
      }

      const [admin, user] = await this.prisma.$transaction([
        this.prisma.admin.create({
          data: {
            name: createAdminDto.name,
          },
        }),
        this.prisma.user.create({
          data: {
            firstName: createAdminDto.firstName,
            lastName: createAdminDto.lastName,
            email: createAdminDto.email,
            phoneNumber: createAdminDto.phoneNumber,
            password: hash,
            roleId: createAdminDto.roleId,
            isSubAdmin: true,
            createdBy: userId,
          },
        }),
      ]);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { adminId: admin.id },
      });

      return admin;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async findAll(page: number, search: string, userId: number) {
    console.log('userId', userId);

    try {
      const filter: Prisma.UserWhereInput = {
        createdBy: { equals: userId },
        isActive: true,

        OR:
          search != null || ''
            ? [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { phoneNumber: { contains: search } },
              ]
            : undefined,
      };
      const totalCount = await this.prisma.user.count({
        where: filter,
      });
      const users = await this.prisma.user.findMany({
        skip: page == 1 || page == 0 ? 0 : (page - 1) * 10,
        take: page == 0 ? undefined : 10,
        where: filter,
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          admin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return await Pagination(page, users, totalCount);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const updateAdmin = await this.prisma.admin.update({
        where: { id: id },
        data: {
          name: updateAdminDto.name,
        },
      });
      await this.prisma.user.updateMany({
        where: {
          AND: [{ id: id }, { isSubAdmin: true }],
        },
        data: {
          firstName: updateAdminDto.firstName,
          lastName: updateAdminDto.lastName,
          email: updateAdminDto.email,
          phoneNumber: updateAdminDto.phoneNumber,
          roleId: updateAdminDto.roleId,
        },
      });

      return updateAdmin;
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
        user: {
          updateMany: {
            where: { adminId: id },
            data: {
              isActive: false,
            },
          },
        },
      },
    });
  }
}
