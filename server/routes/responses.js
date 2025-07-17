import express from 'express';
import FormResponse from '../models/FormResponse.js';
import Form from '../models/Form.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Submit form response (public endpoint)
router.post('/', async (req, res) => {
  try {
    const { formId, responses } = req.body;

    if (!formId || !responses) {
      return res.status(400).json({ message: 'Form ID and responses are required' });
    }

    // Verify form exists and is active
    const form = await Form.findOne({ _id: formId, isActive: true });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or inactive' });
    }

    // Create response
    const formResponse = new FormResponse({
      formId,
      responses,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    await formResponse.save();

    // Update response count
    await Form.findByIdAndUpdate(formId, { 
      $inc: { responseCount: 1 } 
    });

    res.status(201).json({ 
      message: 'Response submitted successfully',
      responseId: formResponse._id 
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get responses for a form (auth required)
router.get('/form/:formId', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.formId, 
      createdBy: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await FormResponse.find({ formId: req.params.formId })
      .sort({ createdAt: -1 });
    
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export responses as CSV (auth required)
router.get('/export/:formId', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.formId, 
      createdBy: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await FormResponse.find({ formId: req.params.formId })
      .sort({ createdAt: -1 });

    // Create CSV content
    const headers = ['Submitted At', ...form.questions.map(q => q.question)];
    const csvRows = [headers.join(',')];

    responses.forEach(response => {
      const row = [
        new Date(response.createdAt).toISOString(),
        ...form.questions.map(q => {
          const answer = response.responses.get(q._id.toString()) || '';
          return `"${answer.replace(/"/g, '""')}"`;
        })
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}-responses.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
