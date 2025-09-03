exports.verifyGoogleJWTService = async (client, token) => {
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
  } catch (err) {
    throw err;
  }
  const payload = ticket.getPayload();
  return payload;
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
}


