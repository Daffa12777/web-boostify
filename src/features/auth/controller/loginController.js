
const { loginUser } = require("../services/loginService");

const login = async (req, res) => {
  try {

    const data = await loginUser(
      req.body.assisstant_code,
      req.body.password
    );

    res.status(200).json(data);

  } catch (error) {

    res.status(400).json({
      status: false,
      message: error.message,
    });

  }
};

module.exports = login;

