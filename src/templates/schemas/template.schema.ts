import * as mongoose from 'mongoose';

export const TemplateSchema = new mongoose.Schema({
  _id: String,
  data: Object,
  name: String,
  createdBy: { type: String, ref: 'User', required: false },
  createAt: Date,
  modifiedAt: Date,
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false,
  },
});
