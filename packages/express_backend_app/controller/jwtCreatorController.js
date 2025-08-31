exports.preflightOptions = (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.sendStatus(200);
}

exports.jwtCreatorPost = (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  const cred = req.body.credential;
  return res.json(cred);
}
