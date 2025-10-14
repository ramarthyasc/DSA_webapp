
exports.preflightOptionsSetter = (req, res) => {
  //setting the headers
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
}

exports.corsAllowResponseSetter = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
}
