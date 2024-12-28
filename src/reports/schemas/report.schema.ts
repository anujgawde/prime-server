import * as mongoose from 'mongoose';

export const ReportSchema = new mongoose.Schema({
  _id: String,
  name: String,
  data: Object,
  templateId: {
    type: String,
    ref: 'Template',
    required: true,
  },
  createdBy: { type: String, ref: 'User', required: false },
  createAt: Date,
  modifiedAt: Date,
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false,
  },
});
