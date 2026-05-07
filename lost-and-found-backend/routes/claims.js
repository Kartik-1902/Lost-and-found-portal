const express = require('express');
const Claim = require('../models/Claim');
const Item = require('../models/Item');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { itemId, claimantName, contactInfo, proof } = req.body;
    if (!itemId || !claimantName || !contactInfo || !proof) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const claim = new Claim({ itemId, claimantName, contactInfo, proof });
    const savedClaim = await claim.save();
    return res.status(201).json(savedClaim);
  } catch (err) {
    console.error('Create claim error:', err);
    return res.status(500).json({ error: 'Failed to create claim' });
  }
});

router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('itemId', 'itemName')
      .sort({ dateSubmitted: -1 });
    return res.status(200).json(claims);
  } catch (err) {
    console.error('Fetch claims error:', err);
    return res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'approved') {
      await Item.findByIdAndUpdate(claim.itemId, {
        status: 'Claimed',
        claimedBy: claim.claimantName,
        claimedContact: claim.contactInfo,
        claimedOn: new Date(),
      });
    }

    const updatedClaim = await Claim.findById(req.params.id).populate('itemId', 'itemName');
    return res.status(200).json(updatedClaim);
  } catch (err) {
    console.error('Update claim error:', err);
    return res.status(500).json({ error: 'Failed to update claim' });
  }
});

module.exports = router;
