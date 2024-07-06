import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrganizationService } from '../services';
import { AuthGuard } from '@/api/auth/guards';
import { User } from '@/api/user/decorators';
import { User as UserModel } from '@prisma/client';
import { addUserToOrganizationDto, createOrganizationDto } from '../dtos';

@UseGuards(AuthGuard)
@Controller({
  path: 'api/organisations',
})
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  async getAllOrganizations(@User() user: UserModel) {
    return this.organizationService.getUsersOrganizations(user);
  }

  @Get('/:orgId')
  async getSingleOrg(@Param('orgId') orgId: string) {
    return this.organizationService.getSingleOrganization(orgId);
  }

  @Post()
  async createOrganization(
    @Body(ValidationPipe) CreateOrganizationDto: createOrganizationDto,
    @User() user: UserModel,
  ) {
    return this.organizationService.createOrganization(
      CreateOrganizationDto,
      user,
    );
  }

  @Post('/:orgId/users')
  async addUserToOrg(
    @Body(ValidationPipe) addUserToOrgDto: addUserToOrganizationDto,
    @Param('orgId') orgId: string,
    @User() user: UserModel,
  ) {
    return this.organizationService.addUserToOrganization(
      addUserToOrgDto,
      orgId,
      user,
    );
  }
}
