import mongoose from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export class DemoteEmployeeDto {
  employeeId: mongoose.Types.ObjectId;
  employeeOrganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
  demoterOganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
  newRole: string;
}
