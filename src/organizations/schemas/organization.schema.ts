import * as mongoose from 'mongoose';

export const OrganizationSchema = new mongoose.Schema(
  {
    name: String,
    emailDomain: String,
    address: String,
    status: String,
    settings: Object,
    owners: Object,
    createdAt: Date,
  },
  {
    timestamps: true,
  },
);
