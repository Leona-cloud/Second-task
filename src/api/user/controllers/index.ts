import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { User } from '../decorators';
import { User as UserModel } from '@prisma/client';
import { AuthGuard } from '@/api/auth/guards';

@UseGuards(AuthGuard)
@Controller({
  path: 'api/users',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string, @User() user: UserModel) {
    return this.userService.getUser(id, user);
  }
}
