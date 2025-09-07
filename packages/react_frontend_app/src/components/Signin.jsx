import { useEffect, useId } from 'react';

function Signin({ setIsLoggedIn, setJsonWebToken }) {
  const navId = useId();

  async function handleCredentialResponse(response) {
    console.log(response.credential);

    const loginRes = await fetch("/draw-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    })

    let res;
    if (loginRes.ok) {
      // As Signin render cannot be seen after signin, this function will be run only once per signin. So we can use local memory variable
      // instead of using : setState, then giving a fake await to rerender the parent component and set the state, then giving that state to the fetch
      // function.
      const { accessToken: jwt } = await loginRes.json();
      console.log(jwt);

      // Get request to Secure route using JWT
      res = await fetch("/draw-secure", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` }
      })
    } else {
      console.log("HTTP Status: ", loginRes.status);
      console.log("Status Text: ", loginRes.statusText);
      return; //end the function
    }

    if (res.ok) {

      const { accessToken: newJwt } = await res.json();
      console.log(`New Jwt is here : ${newJwt}`);
      setJsonWebToken(newJwt);
      setIsLoggedIn(true);


    } else { //If a hacker is doing Replay attack, then we won't get anything from server, and gets status 400. We
      // will set isLoggedIn as False - to logout of this browser. Here in this function, we won't do anything as its appropriate.
      console.log("HTTP Status: ", res.status);
      console.log("Status Text: ", res.statusText);
      return;
    }
  }




  useEffect(() => {
    google.accounts.id.initialize({
      client_id: '945905776134-1scvn29a137jkdghbukadhe7jb4hmb9r.apps.googleusercontent.com',
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
      <ul>
        <li>Sign in</li>
      </ul>
      <div className='authorize'>
        <div id={navId}></div>
      </div>
    </>
  )



}


export default Signin;

