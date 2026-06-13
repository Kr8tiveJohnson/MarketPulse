const express = require('express');
const router = express.Router();
const Market = require('../models/Market');

router.get('/', async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const market = new Market(req.body);
  try {
    const newMarket = await market.save();
    res.status(201).json(newMarket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
