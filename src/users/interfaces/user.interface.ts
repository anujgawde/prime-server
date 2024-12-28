import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  basicInformation: {
    firstName: string;
    lastName?: string;
    email: string;
  };
  contactInformation: {
    address?: string;
    phoneNumber: string;
  };
  organization: {
    id: any;
    roles: string;
  };
}
