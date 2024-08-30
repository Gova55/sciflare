 import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('')
  async signIn(@Body() credentials: LoginAuthDto) {
    const result = await this.auth.signIn(credentials);

    return {
      status: true,
      data: result,
      message: 'User logged in successfully',
    };
  }
}
