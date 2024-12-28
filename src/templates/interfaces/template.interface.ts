import mongoose, { Document } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export interface ITemplate extends Document {
  _id: string;
  data: any;
  name: string;
  createdBy: Partial<IUser>;
  createAt: Date;
  modifiedAt: Date;
  organizationId?: string;
}
