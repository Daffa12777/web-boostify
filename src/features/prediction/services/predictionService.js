// src/features/prediction/services/predictionService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// CATATAN: kalau kamu sudah punya shared prisma client (1 instance), import itu saja
// biar gak bikin koneksi baru. Ganti 2 baris di atas dengan: const prisma = require('...');

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const getCrowdPrediction = async () => {
    // ambil semua waktu check-in
    const records = await prisma.attendance.findMany({ select: { time: true } });

    // buckets[day][hour] = { total, dates:Set }
    const buckets = {};
    for (let d = 0; d < 7; d++) buckets[d] = {};

    for (const r of records) {
        const t = new Date(r.time);
        // pakai UTC karena Timestamp disimpan tanpa timezone (wall-clock asli terjaga).
        // Kalau jam keliatan geser, ganti ke getHours()/getDay() atau sesuaikan offset WIB.
        const day = t.getUTCDay();
        const hour = t.getUTCHours();
        const dateKey = t.toISOString().slice(0, 10);

        if (!buckets[day][hour]) buckets[day][hour] = { total: 0, dates: new Set() };
        buckets[day][hour].total += 1;
        buckets[day][hour].dates.add(dateKey);
    }

    // rata-rata check-in per slot (total dibagi jumlah hari unik slot itu pernah aktif)
    let maxAvg = 0;
    const heatmap = [];
    for (let d = 0; d < 7; d++) {
        for (let h = 0; h < 24; h++) {
            const b = buckets[d][h];
            if (!b) continue;
            const occurrences = b.dates.size;
            const avg = occurrences ? b.total / occurrences : 0;
            if (avg > maxAvg) maxAvg = avg;
            heatmap.push({
                day: d,
                dayName: DAYS[d],
                hour: h,
                avgCheckins: Number(avg.toFixed(1)),
                totalCheckins: b.total,
            });
        }
    }

    // klasifikasi level relatif terhadap slot tersibuk
    const classify = (avg) => {
        if (maxAvg === 0) return 'sepi';
        const ratio = avg / maxAvg;
        if (ratio >= 0.66) return 'ramai';
        if (ratio >= 0.33) return 'sedang';
        return 'sepi';
    };
    heatmap.forEach((s) => (s.level = classify(s.avgCheckins)));

    // 3 slot tersibuk
    const busiest = [...heatmap]
        .sort((a, b) => b.avgCheckins - a.avgCheckins)
        .slice(0, 3)
        .map((s) => ({ label: `${s.dayName} ${String(s.hour).padStart(2, '0')}:00`, avgCheckins: s.avgCheckins }));

    return {
        totalRecords: records.length,
        maxAvg: Number(maxAvg.toFixed(1)),
        busiest,
        heatmap,
    };
};

module.exports = { getCrowdPrediction };