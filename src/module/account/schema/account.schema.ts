import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/guard/role/role.enum';

export type AccountDocument = Account & Document;

@Schema({ toObject: { getters: true }, versionKey: false })
export class Account {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: 'en' })
  language?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ select: false })
  redisSessionId?: string;

  @Prop({ select: false, enum: [Role.Admin, Role.User] })
  role: [string];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
