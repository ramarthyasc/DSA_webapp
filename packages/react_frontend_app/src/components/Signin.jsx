import { useEffect, useId } from 'react';
import '../styles/Signin.css';

function Signin({ setIsLoggedIn, setJsonWebToken, setUser }) {
  const navId = useId();

  async function handleCredentialResponse(response) {
    //console.log(response.credential);

    const loginRes = await fetch("/draw-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ credential: response.credential }),
    })

    let res;
    if (loginRes.ok) {
      const { accessToken: jwt } = await loginRes.json();

      // Get request to Secure route using JWT
      res = await fetch("/draw-secure", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
        credentials: "include",
      })
    } else {
      console.log("HTTP Status: ", loginRes.status);
      console.log("Status Text: ", loginRes.statusText);
      return; //end the function
    }

    if (res.ok) {

      const { accessToken, userDetail } = await res.json();
      //console.log(`Access Token : ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);
      setJsonWebToken(accessToken);
      setIsLoggedIn(true);
      setUser(userDetail);


    } else { //If a hacker is doing Replay attack, then we won't get anything from server, and gets status 400. We
      // will set isLoggedIn as False - to logout of this browser. Here in this function, we won't do anything as setLoggedIn is currently false
      console.log("HTTP Status: ", res.status);
      console.log("Status Text: ", res.statusText);
      return;
    }
  }



  // 'Mine' Effect
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      ux_mode: "popup",
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById(navId),
      {
        type: "icon",
        size: "small",
        shape: "circle",
        theme: "filled_blue",
      }

    )


  }, []);

  return (
    <>
      <div className='signin-block'>
        <ul className='signin'>
          <li>Sign in</li>
        </ul>
        <div className='authorize'>
          <div id={navId}></div>
        </div>
      </div>
    </>
  )



}


export default Signin;

