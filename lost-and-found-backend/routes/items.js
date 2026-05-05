const express = require('express');
const Item = require('../models/Item');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { contactInfo, itemName, category, status, description } = req.body;
    const reporterName = req.user?.username;

    if (!reporterName || !contactInfo || !itemName || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = new Item({
      reporterName,
      contactInfo,
      itemName,
      category,
      status,
      description,
    });

    const saved = await item.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Create item error:', err);
    return res.status(500).json({ error: 'Failed to create item' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error('Fetch items error:', err);
    return res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const requester = req.user?.username;
    const role = req.user?.role;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!requester || (role !== 'admin' && item.reporterName !== requester)) {
      return res.status(403).json({ error: 'Not allowed to update this item' });
    }

    const updates = { ...req.body };
    delete updates.reporterName;
    delete updates._id;
    delete updates.dateReported;

    const updated = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update item error:', err);
    return res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const requester = req.user?.username;
    const role = req.user?.role;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!requester || (role !== 'admin' && item.reporterName !== requester)) {
      return res.status(403).json({ error: 'Not allowed to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    return res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
