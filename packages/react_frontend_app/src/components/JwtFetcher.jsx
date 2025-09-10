import { useEffect, useState } from 'react';

// For When you Refresh your page
function JwtFetcher({ children, jsonWebToken, setIsLoggedIn, isLoggedIn, setJsonWebToken, setUser }) {

  // Helper state
  const [error, setError] = useState(null);

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
        } catch (err) {//If the server send using sendStatus(400), then error occurs above as it can't parse statuscode to json.
          //res.ok == false. But it doesn't send any body.
          console.log("HTTP Status: ", res.status);
          console.log("Status Text: ", res.statusText);
          return; // Stop the function here
        }

        if (res.ok) {

          const { accessToken, userDetail, error } = data;

          if (accessToken && userDetail) {
            console.log(`Access Token: ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);

            setJsonWebToken(accessToken);
            setIsLoggedIn(true);
            setUser(userDetail);
          }
          if (error === "NO_REFRESH_TOKEN") {

            setError(error);
          }


        } else {
          console.log(`error: ${error}`);

        }
      }

    }

    fetcher();


  }, [])


  if (!isLoggedIn && error !== "NO_REFRESH_TOKEN") {
    //Render this first in Real DOM, then run useEfects - which schedule state change. Then rerun the component. Now return Children
    // The main render we need. This all happens fast that you won't see the "Loading" text.
    return "Loading...";
  }

  //When state changes, render this.
  return <>{children}</>;

}


export default JwtFetcher;
