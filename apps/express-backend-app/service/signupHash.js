const argon2 = require("argon2");

exports.signupHash = async function(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw err;
  };
}


