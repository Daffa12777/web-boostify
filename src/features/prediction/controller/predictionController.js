// src/features/prediction/controller/predictionController.js

const { getCrowdPrediction } = require('../services/predictionService');

const getCrowdPredictionController = async (req, res) => {
    try {
        const data = await getCrowdPrediction();
        res.status(200).json({
            success: true,
            payload: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating crowd prediction',
            error: error.message,
        });
    }
};

module.exports = getCrowdPredictionController;