import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/common/database/prisma.service';
import { Config } from 'src/common/config/config';
import { LoginAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signIn = async (credentials: LoginAuthDto) => {
    const user = await this.prisma.user.findFirst({
      where: { email: credentials.email, isActive: true },
    });

    if (!user) {
      throw new BadRequestException('Not a registered user');
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Password does not match');
    }

    const signInToken = sign({ userId: user.id }, Config.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return await this.prisma.user.update({
      where: { id: user.id },
      data: { token: signInToken },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        token: true,
        isActive: true,
        isAdmin: true,
        isSubAdmin: true,
        role: true,
      },
    });
  };
}
