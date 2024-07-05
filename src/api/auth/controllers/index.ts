import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services';
import { RegisterDto } from '../dtos';
import { Request } from 'express';

@Controller({
  path: 'user/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async SignUp(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Req() req: Request,
  ) {
    return await this.authService.register(registerDto);
  }
}
