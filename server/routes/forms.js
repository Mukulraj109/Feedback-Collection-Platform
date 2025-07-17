import express from 'express';
import Form from '../models/Form.js';
import FormResponse from '../models/FormResponse.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Get all forms for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single form for authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get public form (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or inactive' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching public form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new form
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, questions, isActive } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const form = new Form({
      title,
      description,
      questions,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update form
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, questions, isActive } = req.body;
    
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { title, description, questions, isActive },
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete form
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Also delete all responses for this form
    await FormResponse.deleteMany({ formId: req.params.id });
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
