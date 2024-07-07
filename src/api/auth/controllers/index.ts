import { Body, Controller, HttpCode, HttpStatus, Post, Req, UsePipes } from '@nestjs/common';
import { AuthService } from '../services';
import { LoginDto, RegisterDto } from '../dtos';
import { Request } from 'express';
import { ValidationPipe } from '@/core/pipe/validation';

@Controller({
  path: 'api/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async SignUp(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Req() req: Request,
  ) {
    return await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async Login(@Body(ValidationPipe) loginDto:LoginDto){
    return await this.authService.login(loginDto)
  }

}
