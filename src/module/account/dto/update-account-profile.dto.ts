import {
  IsDate,
  IsEmail,
  IsIn,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateAccountDTO {
  @IsString()
  @Length(0, 747)
  firstName?: string;

  @IsString()
  @Length(0, 747)
  lastName?: string;

  @IsString()
  @Length(8, 50)
  password?: string;

  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsString()
  @Length(11, 12)
  phone?: string;

  @IsString()
  @IsIn(['female', 'male'])
  gender: string;

  @IsString()
  @MaxLength(200)
  avatar: string;

  @IsString()
  @IsIn(['en', 'cn', 'ms'])
  language?: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}
