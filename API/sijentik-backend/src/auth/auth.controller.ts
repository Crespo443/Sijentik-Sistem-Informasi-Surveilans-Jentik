import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: { name: string; access_code: string; role: string },
  ) {
    return this.authService.validateAccessCode(
      body.name,
      body.access_code,
      body.role,
    );
  }
}
