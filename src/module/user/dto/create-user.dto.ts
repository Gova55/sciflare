import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]{1,29}$')
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]$')
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^\\d{10}$')
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}

