import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'email',
    type: 'string',
    example: 'stan@gmail.com',
  })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'password',
    type: 'string',
    example: '5hh#I$KPCfdqD8b1r5S7rlHY0',
  })
  @IsString()
  @Length(8, 50)
  password: string;
}
