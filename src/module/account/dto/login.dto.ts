import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
