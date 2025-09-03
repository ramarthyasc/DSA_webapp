import { useEffect, useId } from 'react';

function Signin({ isLoggedIn, setIsLoggedIn, jsonWebToken, setJsonWebToken }) {
  const navId = useId();

  async function handleCredentialResponse(response) {
    console.log(response.credential);

    const loginRes = await fetch("http://localhost:5000/draw-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    })

    const jwt = await loginRes.json();
    console.log(jwt);
    setJsonWebToken(jwt);

    //   const secureRes = await fetch("http://localhost:5000/draw-secure", {
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${jsonWebToken}` }
    //   })
    //
    //   const newJwt = await secureRes.json();
    //   console.log(`New Jwt is here : ${newJwt}`);
    //   setJsonWebToken(newJwt);
    // }
    // DO THINGS HEREEEEEE. to get the session state of the user(if the user was an existing one)
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
