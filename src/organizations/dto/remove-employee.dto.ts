import mongoose from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

export class RemoveEmployeeDto {
  employeeId: mongoose.Types.ObjectId;
  employeeOrganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
  removerOganization: {
    id: mongoose.Types.ObjectId;
    roles: string;
  };
}
