exports.secureRouteGet = (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');

  const accessToken = res.locals.accessToken;
  const userDetail = res.locals.userDetail;

  return res.json({ accessToken, userDetail });
}
