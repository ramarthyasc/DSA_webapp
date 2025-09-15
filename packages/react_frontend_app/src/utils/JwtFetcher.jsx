import { useEffect, useState } from 'react';
import { ErrorContext } from '../context/ErrorContext';

// Used for When you Refresh your page (If there is Valid refresh token, then generate new JWT from server. If no Valid RT, then don't give access)
function JwtFetcher({ children, jsonWebToken, isLoggedIn, setIsLoggedIn, setJsonWebToken, setUser }) {

  const [error, setError] = useState(false);


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
          setError(true);

          return; // Stop the function here
        }

        if (res.ok) {

          const { accessToken, userDetail, rtError } = data;

          if (accessToken && userDetail) {
            //console.log(`Access Token: ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);
            console.log("Jwt is generated after page refresh using Refresh Token");

            setJsonWebToken(accessToken);
            setIsLoggedIn(true);
            setUser(userDetail);

          }
          if (rtError) {

            // typically rtError = "NO_REFRESH_TOKEN". If rtError = "INVALID_REFRESH_TOKEN", 
            // then Hacker is attempting or I refreshed the page after signing out.
            // When Signing out, I revoke the RT, but the cookie containing that RT is still there.
            console.log(`Refresh token error: ${rtError}`);
            setError(true);

          }


        }
      }

    }

    fetcher();


  }, [])

  //NOTE: When we return Children or Outlet - then they are renders. So only after all the Consecutive renders are done, then only
  // the useEffects are run. This is BAD - if the useEffects has async functions in it. Because those useEffects run asynchronously.
  // Not in a linear manner. Which can play mischief when there are dependent states in those useEffects - thus making race conditions.
  // Eg: in the first useEffect if we had await which decides if the isLoggedIn is true or false. Then as it is await, it jumps to next useEffect
  // which decides another function based on the isLoggedIn.
  // So to PREVENT THIS, Whenever a COMPONENT return a children or outlet or any other <<<DYNAMIC RENDER>>>, then do block it using "...loading"
  // and then run the Component's useEffect in there itself. Then only, return the DYNAMIC RENDER. 
  // Here, in this pattern, we can use localvariables without useState - inside UseEffect where there is no state changers.
  //NOTE:  Even if the Dynamic Renders returned are the SAME, we have to make sure that, useEffects is run here itself, if that useEffects have await.
  // ie; The AWAITS SHOULD BE DONE right here AND WE SHOULD GET THE RESULTS HERE ITSELF. THEN ONLY, WE SHOULD RETURN THE DYNAMIC RENDER. 
  // For no errors down the ROAD.
  // THE THING IS THAT< ONLY AFTER GETTING RESULT FROM AWAIT (error or result), is when WE SHOULD return the DYNAMIC RENDER.

  // We set the if else logic of letting the user in or not - inside the Component itself (using isLoggedIn) - so that
  // I don't clutter this JwtFetcher component - which is for handling REFRESHES only- Good practice for me.

  //Runs this only if we refreshed the page 

  //Note here
  // When there is no jsonWebToken, then it is always noLogged in as they always go together.
  //NOTE: (Refresh page flow and Signout page flow)
  if (!isLoggedIn) {
    if (error === true) return <>{children}</>  // Only return DYNAMIC RENDERS (render the Children) only after
    //we made sure that useEffects is run fully in here itself.
    return "...loading"; // block the flow to the children - so that useEffect runs here. (useEffects are prevented from compounding & running last
    // ie; after all children and things are rendered)
  }



  // Return children after we made sure that useEffects ran here itself. Here, it returns if isLoggedIn is true NOTE: (In Normal flow)
  return (

    <ErrorContext.Provider value={setError}>
      <>{children}</>
    </ErrorContext.Provider>
    //Render this first in Real DOM, then runs useEfects (only 1 time) - which schedule state change. Then reruns the component.
    // which gives the The main render we need. This all happens fast that you won't see the initial Children (typically, we use "loading.." text) page.
  )

}


export default JwtFetcher;
