import mongoose from 'mongoose';


const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  responses: {
    type: Map,
    of: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

formResponseSchema.index({ formId: 1, createdAt: -1 });

const FormResponse = mongoose.model('FormResponse', formResponseSchema);
 export  default FormResponse;