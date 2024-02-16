import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;
}

@Schema()
export class User extends Document {
  @Prop({ index: 'text' })
  firstName: string;

  @Prop({ index: 'text' })
  lastName: string;

  @Prop({ index: true })
  email: string;

  @Prop({ required: true, unique: true, index: 'text' })
  username: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  age: number;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Address })
  address: Address;

  @Prop()
  jobTitle: string;

  @Prop()
  companyName: string;

  @Prop()
  catchPhrase: string;

  @Prop()
  dateOfBirth: Date;

  // Assuming you want to enable text search on these fields
  @Prop({ index: 'text' })
  bio: string;

  @Prop({ index: 'text' })
  website: string;

  @Prop({ default: [] })
  skills: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
