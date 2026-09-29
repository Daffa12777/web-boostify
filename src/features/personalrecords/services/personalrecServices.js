const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAttendanceByCode = async (assisstant_code, page = 1, limit = 5) => {
    const skip = (page - 1) * limit;

    const assistances = await prisma.attendance.findMany({
        where: { assisstant_code },
        skip,
        take: limit,
        orderBy: {
            time: 'desc',
        },
        select: {
            assisstant_code: true,
            name: true,
            time: true,
        },
    });

    const total = await prisma.attendance.count({ where: { assisstant_code } });

    if (assistances.length === 0) {
        return null;
    }

    const formattedAttendances = assistances.map(record => ({
        time: record.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        rawTime: record.time
    }));

    return {
        name: assistances[0].name,
        assistanceCode: assisstant_code,
        attendancesTime: formattedAttendances,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = {
    getAttendanceByCode,
};