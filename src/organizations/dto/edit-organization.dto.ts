import mongoose from 'mongoose';
import { IOrganization } from '../interfaces/organization.interface';

export class EditOrganizationDto {
  editorRole: string;
  editorId: string;
  data: {
    name: string;
    address: string;
    emailDomain: string;
    _id: string;
  };
}
