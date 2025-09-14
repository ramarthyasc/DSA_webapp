import '../styles/Userin.css';


async function signout({ setIsLoggedIn, setJsonWebToken, setUser }) {
  setIsLoggedIn(false);
  setJsonWebToken(null);
  setUser(null);

  //Revoke refresh token
  const res = await fetch('/draw-secure', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ revokeRefreshToken: true }),
  })

  // DO THIS WHEN THE USER TRIES TO GO TO ANY PATH IN THE WEBSITE.
  // if there was no refresh token send to server (as due to expiry) - then server sends rtError.
  // if there was an invalid (revoked/expired/different) refresh token send to server (Hacker) - then server sends a different valued rtError.

  //DO THIS WHEN USER SIGNSOUT : 
  // if there was a Valid (non revoked, non expired) refresh token send to server - then server REVOKES THE RT, then gives rtError(for simplicity).
  let data;
  try {
    data = await res.json();
  } catch (err) {
    // any server error that the server responds with
    // res.ok == false
    console.log("HTTP Status: ", res.status);
    console.log("Status Text: ", res.statusText);
    return;
  }

  if (res.ok) {
    const { rtError } = data;
    console.log(`Action upon Refresh Token : ${rtError}`);
    return;
  }

}


function Userin({ setIsLoggedIn, setJsonWebToken, setUser, user }) {

  return (

    <>
      <ul className='user'>
        <li className='name'>{user.name}</li>
        <li className='dropdown'>
          <img src={user.picture} alt="profile-picture" className='profile-pic' />
          <ul className='profile-menu'>
            <li onClick={() => { signout({ setIsLoggedIn, setJsonWebToken, setUser }) }}>Signout</li>
          </ul>
        </li>
      </ul>
    </>
  )
}

export default Userin;
export { signout };
