import { IUser } from 'src/users/interfaces/user.interface';

export class CreateOrganizationDto {
  name: string;
  emailDomain: string;
  address: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: Record<string, any>;
  owners: IUser[];
  createdAt: Date;
}
