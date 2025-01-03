const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Item = require('../models/item');
const Form = require('../models/form'); // Ensure the Form model is imported

// GET: Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get a form by ID
router.put('/api/forms/:formId', async (req, res) => {
  const { formId } = req.params;
  console.log('Received formId:', formId);

  if (!formId) {
    return res.status(400).send('Form ID is missing.');
  }

  const { name, bubbles } = req.body;

  // Validate the request body
  if (!name || !Array.isArray(bubbles)) {
    return res.status(400).send('Invalid request body. Name and bubbles are required.');
  }

  try {
    // Find the form by ID and update it
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { name, bubbles },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedForm) {
      return res.status(404).send('Form not found.');
    }

    // Send the updated form back to the client
    res.status(200).json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).send('An error occurred while updating the form.');
  }
});


// POST: Create an item
router.post('/', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    type: req.body.type,
  });

  try {
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete an item by ID
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  try {
    const result = await Item.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
