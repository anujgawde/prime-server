import mongoose from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export class PromoteEmployeeDto {
  employeeId: mongoose.Types.ObjectId;
  employeeOrganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
  promoterOganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
  newRole: string;
}
