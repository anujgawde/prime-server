import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  _id: String,
  basicInformation: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
  },
  contactInformation: {
    address: { type: String, required: false },
    phoneNumber: { type: String },
  },
  organization: Object,
});
