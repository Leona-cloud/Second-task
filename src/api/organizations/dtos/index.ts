import { IsNotEmpty, IsString } from 'class-validator';

export class createOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;
}


export class addUserToOrganizationDto{
    @IsNotEmpty()
    @IsString()
    userId: string
}