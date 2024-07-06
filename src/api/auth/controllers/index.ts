import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services';
import { LoginDto, RegisterDto } from '../dtos';
import { Request } from 'express';

@Controller({
  path: 'api/auth',
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

  @Post('login')
  async Login(@Body(ValidationPipe) loginDto:LoginDto){
    return await this.authService.login(loginDto)
  }

}
