import { Document } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export interface IOrganization extends Document {
  name: string;
  emailDomain: string;
  address: string;
  status: 'active' | 'inactive' | 'suspended';
  owners: IUser[];
  createdAt: Date;
  settings: Record<string, any>; // JSON object for customizable settings
}
