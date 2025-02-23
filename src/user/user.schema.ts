import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument } from 'mongoose-delete';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;
}

export type UserDocument = User & Document & SoftDeleteDocument;
export const UserSchema = SchemaFactory.createForClass(User);

// Apply the mongoose-delete plugin to the schema
UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
