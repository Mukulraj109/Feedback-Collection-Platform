import mongoose from 'mongoose';


const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'multiple-choice'],
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    trim: true,
  }],
  required: {
    type: Boolean,
    default: true,
  },
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  responseCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

formSchema.virtual('responses', {
  ref: 'FormResponse',
  localField: '_id',
  foreignField: 'formId',
});

const Form = mongoose.model('Form', formSchema);
export default Form;