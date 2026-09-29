// src/features/prediction/controller/predictionNext3Controller.js
const { getPredictionNext3Hours } = require('../services/predictionNext3Service');

const getPredictionNext3Controller = async (req, res) => {
  try {
    const data = await getPredictionNext3Hours();
    res.json({ success: true, payload: data });
  } catch (error) {
    console.error('Prediction next3 error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch prediction', error: error.message });
  }
};

module.exports = getPredictionNext3Controller;