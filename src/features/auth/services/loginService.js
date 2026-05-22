
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const loginUser = async (assisstant_code, password) => {

  console.log("LOGIN REQUEST:");
  console.log("CODE:", assisstant_code);
  console.log("PASSWORD:", password);

  const user = await prisma.assisstant.findUnique({
    where: { assisstant_code },
  });

  console.log("USER DB:", user);

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload = {
    id: user.id,
    name: user.name,
    assisstant_code: user.assisstant_code,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const data = {
    status: true,
    message: "success",
    payload,
    token
  };

  return data;
};

module.exports = { loginUser };

