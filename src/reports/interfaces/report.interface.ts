import { Document } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

import { ITemplate } from 'src/templates/interfaces/template.interface';
export interface IReport extends Document {
  _id: string;
  name: string;
  data: any;
  templateId: Partial<ITemplate>;
  createdBy: Partial<IUser>;
  createAt: Date;
  modifiedAt: Date;
  organizationId?: string;
}
