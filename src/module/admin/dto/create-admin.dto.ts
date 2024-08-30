import {
    IsNotEmpty,
    IsString,
    Matches,
    IsEmail,
    IsNumber,
  } from 'class-validator';
  
  export class CreateAdminDto {
    @IsNotEmpty()
    @IsString()
    @Matches('^[A-Za-z]{1,29}$')
    name: string;
  
    @IsNotEmpty()
    @IsString()
    @Matches('^[A-Za-z]{1,29}$')
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    @Matches('^[A-Za-z]{1,29}$')
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