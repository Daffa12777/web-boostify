const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const accessValidation = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authorization.split(" ")[1];

    const blacklistedToken = await prisma.blacklistedToken.findUnique({
        where: { token },
    });

    if (blacklistedToken) {
        return res.status(403).json({ message: 'Token has been logged out.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        console.log('VERIFY ERROR:', err.message);
        console.log('SECRET LENGTH:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'UNDEFINED');
        return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
});
}

module.exports = accessValidation;
