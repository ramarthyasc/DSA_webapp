import '../styles/Navigate.css';
import { useEffect, useId } from 'react';

function Navigate() {

  const navId = useId();

  function handleCredentialResponse(response) {
    console.log(response.credential);
    fetch("http://localhost:5000/auth-receiver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(res => {
        console.log("Hello");
        return res.json();
      })
      .then(user => {
        console.log(user);
      })

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
    <div>
      <nav className='nav'>
        <ul>
          <li>Sign in</li>
        </ul>
        <div className='authorize'>
          <div id={navId}></div>
        </div>
      </nav>
    </div>

  )
}

export default Navigate;
