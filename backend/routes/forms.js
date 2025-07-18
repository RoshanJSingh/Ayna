const express = require('express');
const Form = require('../models/Form');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const form = new Form({
      title,
      description,
      questions,
      createdBy: req.userId
    });

    await form.save();
    res.status(201).json({ message: 'Form created successfully', form });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, questions, isActive } = req.body;
    
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.title = title || form.title;
    form.description = description || form.description;
    form.questions = questions || form.questions;
    form.isActive = isActive !== undefined ? isActive : form.isActive;

    await form.save();
    res.json({ message: 'Form updated successfully', form });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
