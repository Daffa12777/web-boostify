// src/features/prediction/services/predictionNext3Service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPredictionNext3Hours = async () => {
  const now = new Date();

  // Convert JS day (0=Sunday) to match DB format (0=Sunday..6=Saturday)
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  // Build slots for next 3 hours (might wrap to next day)
  const slots = [];
  for (let i = 1; i <= 3; i++) {
    let targetHour = currentHour + i;
    let targetDay = currentDay;

    if (targetHour >= 24) {
      targetHour -= 24;
      targetDay = (targetDay + 1) % 7;
    }

    slots.push({ day: targetDay, hour: targetHour });
  }

  // Fetch predictions for these slots from DB
  const predictions = await Promise.all(
    slots.map(({ day, hour }) =>
      prisma.prediction.findFirst({ where: { day, hour } })
    )
  );

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const result = slots.map(({ day, hour }, idx) => {
    const pred = predictions[idx];
    return {
      day,
      hour,
      dayName: DAY_NAMES[day],
      label: `${DAY_NAMES[day]} ${String(hour).padStart(2, '0')}:00`,
      predictedCount: pred ? parseFloat(pred.predicted_count.toFixed(1)) : 0,
      level: pred ? pred.level : 'sepi',
    };
  });

  // Overall summary for next 3 hours
  const levels = result.map((r) => r.level);
  const dominantLevel =
    levels.filter((l) => l === 'ramai').length >= 2
      ? 'ramai'
      : levels.filter((l) => l === 'sedang').length >= 2
      ? 'sedang'
      : 'sepi';

  return {
    currentTime: `${DAY_NAMES[currentDay]} ${String(currentHour).padStart(2, '0')}:00`,
    dominantLevel,
    slots: result,
  };
};

module.exports = { getPredictionNext3Hours };