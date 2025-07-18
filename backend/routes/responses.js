const express = require('express');
const Response = require('../models/Response');
const Form = require('../models/Form');
const authMiddleware = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { formId, answers } = req.body;

    if (!formId || !answers || answers.length === 0) {
      return res.status(400).json({ message: 'Form ID and answers are required' });
    }

    const form = await Form.findById(formId);
    if (!form || !form.isActive) {
      return res.status(404).json({ message: 'Form not found or inactive' });
    }

    const response = new Response({
      formId,
      answers
    });

    await response.save();
    res.status(201).json({ message: 'Response submitted successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/form/:formId', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, createdBy: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 })
      .populate('formId', 'title');

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.userId });
    const formIds = forms.map(form => form._id);
    
    const responses = await Response.find({ formId: { $in: formIds } })
      .populate('formId', 'title');

    const dashboard = {
      totalForms: forms.length,
      totalResponses: responses.length,
      recentResponses: responses.slice(0, 10),
      formStats: forms.map(form => ({
        formId: form._id,
        title: form.title,
        responseCount: responses.filter(r => r.formId._id.toString() === form._id.toString()).length
      }))
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/responses/export/:formId - Export responses as CSV
router.get('/export/:formId', authMiddleware, async (req, res) => {
  try {
    // Verify user owns the form
    const form = await Form.findOne({ _id: req.params.formId, createdBy: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Get all responses for this form
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 })
      .populate('formId', 'title');

    if (responses.length === 0) {
      return res.status(404).json({ message: 'No responses found for this form' });
    }

    // Create CSV headers based on form questions
    const headers = [
      { id: 'submittedAt', title: 'Submitted At' },
      { id: 'responseId', title: 'Response ID' }
    ];

    // Add question headers
    form.questions.forEach((question, index) => {
      headers.push({
        id: `question_${index}`,
        title: question.text
      });
    });

    // Transform responses to CSV format
    const csvData = responses.map(response => {
      const row = {
        submittedAt: response.submittedAt.toISOString(),
        responseId: response._id.toString()
      };

      // Add answers for each question
      form.questions.forEach((question, index) => {
        const answer = response.answers.find(a => 
          a.questionId.toString() === question._id.toString()
        );
        row[`question_${index}`] = answer ? answer.answer : '';
      });

      return row;
    });

    // Create CSV content
    const csvWriter = createCsvWriter({
      path: '', // We'll generate content in memory
      header: headers,
      encoding: 'utf8'
    });

    // Generate CSV string
    let csvContent = headers.map(h => h.title).join(',') + '\n';
    csvData.forEach(row => {
      const values = headers.map(h => {
        const value = row[h.id] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') || value.includes('"') ? 
          `"${value.replace(/"/g, '""')}"` : value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}_responses.csv"`);
    
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
