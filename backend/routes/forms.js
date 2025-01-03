const express = require('express');
const router = express.Router();
const Form = require('../models/form');

// Get a form by ID
router.get('/:id', async (req, res) => {
  console.log('Fetching form with ID:', req.params.id); // Log the ID
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).send('Form not found');
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error); // Log the error
    res.status(500).send('Server error');
  }
});

module.exports = router;