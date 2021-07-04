import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

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

  @Prop({ required: true })
  gender: string;

  @Prop({ default: 'en' })
  language?: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({
    default: 'https://image.flaticon.com/icons/png/512/2922/2922688.png',
  })
  avatar: string;

  @Prop({ select: false })
  redisSessionId?: string;

  @Prop({ select: false })
  role: [string];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
