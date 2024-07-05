import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";




export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail({}, {message: 'Email must be valid'})
    email: string

    @IsPhoneNumber('NG')
    @Length(11, 11, {message: 'Phone number must be 11 digits'})
    phone: string

    @IsNotEmpty()
    @IsString()
    password: string
}