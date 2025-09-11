import { useEffect, useState } from 'react';

// Used for When you Refresh your page (If there is Valid refresh token, then generate new JWT from server. If no Valid RT, then don't give access)
function JwtFetcher({ children, jsonWebToken, setIsLoggedIn, isLoggedIn, setJsonWebToken, setUser }) {


  useEffect(() => {
    async function fetcher() {

      if (!jsonWebToken) {

        const res = await fetch('/draw-secure', {
          method: "GET",
          credentials: 'include',
        })

        let data;
        try {
          data = await res.json();
        } catch (err) {//If the server send using sendStatus(500) - due to any errors in the server,
          // then error occurs above as it can't parse statuscode to json.
          //res.ok == false. But it only sends status code in Text format -which res.json can't parse. So error occurs.
          console.log("HTTP Status: ", res.status);
          console.log("Status Text: ", res.statusText);
          return; // Stop the function here
        }

        if (res.ok) {

          const { accessToken, userDetail, rtError } = data;

          if (accessToken && userDetail) {
            console.log(`Access Token: ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);

            setJsonWebToken(accessToken);
            setIsLoggedIn(true);
            setUser(userDetail);
          }
          if (rtError) {

            // typically rtError = "NO_REFRESH_TOKEN". If rtError = "INVALID_REFRESH_TOKEN", 
            // then Hacker is attempting or I refreshed the page after signing out.
            // When Signing out, I revoke the RT, but the cookie containing that RT is still there.
            console.log(`Refresh token error: ${rtError}`);
          }


        }
      }

    }

    fetcher();


  }, [])


  // We set the if else logic of letting the user in or not - inside the Component itself (using isLoggedIn) - so that
  // I don't clutter this JwtFetcher component - which is for handling REFRESHES only- Good practice for me.


  return <>{children}</>;   //Render this first in Real DOM, then runs useEfects (only 1 time) - which schedule state change. Then reruns the component.
  // which gives the The main render we need. This all happens fast that you won't see the initial Children (typically, we use "loading.." text) page.

}


export default JwtFetcher;
