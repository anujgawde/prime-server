import mongoose from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export class LeaveOrganizationDto {
  _id: mongoose.Types.ObjectId;
  organization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
}
