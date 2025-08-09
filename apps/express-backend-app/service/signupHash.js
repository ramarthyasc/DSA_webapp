const argon2 = require("argon2");

exports.signupHash = async function(password) {
  console.log("Hello");
  try {
    console.log("starting to hash")
    const hash = await argon2.hash(password);
    console.log("end hash")
    return hash;
  } catch (err) {
    console.log("Hello there");
    throw err;
  };
}


