import { useOutletContext } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";

// This component is only reached after JwtFetcher. So if isLoggedIn==true, then all other states will be true( jsonWebToken, etc..)
// OR YOU CAN USE A LOADER TO VERIFY JWT FOR THE ROUTES> new Feature
function JwtAuthorizedRoutes() {
  const [isLoggedIn, setIsLoggedIn, jsonWebToken, setJsonWebToken, setUser, user] = useOutletContext();

  // When a <Link> is clicked, in that moment, the location is changed (pushed to stack). Then because this is React router, 'routes' run
  // from the root Parent to the child components linearly - until it reaches that specific component mapped to the url.
  //
  //So useLocation state is triggered just when you click the <Link> itself.
  const location = useLocation();

  const [jwtIsVerified, setJwtIsVerified] = useState(false);


  //SYNCHRONOUSLY WE CAN CHANGE STATE USING useLayoutEffect (a blocking thread)
  //React renders the component (creates the virtual DOM).
  // DOM mutations are calculated/applied but not yet painted.
  // useLayoutEffect runs immediately, synchronously.
  // Any setState here triggers a new render before the paint.
  // Only after useLayoutEffect finishes does the browser actually paint the screen.
  // And then only is useEffect run.
  useLayoutEffect(() => {
    setJwtIsVerified(false)
  }, [location.pathname]);




  // DO THIS WHEN THE USER TRIES TO GO TO ANY PATH IN THE WEBSITE.
  // if there was no refresh token send to server (as due to expiry) - then server sends rtError.
  // if there was an invalid (revoked/expired/different) refresh token send to server (Hacker) - then server sends a different valued rtError.
  useEffect(() => {

    if (isLoggedIn && !jwtIsVerified) {

      console.log("Helo")
      async function jwtVerify() {
        const res = await fetch("/draw-secure", {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${jsonWebToken}`
          }

        })

        let data;
        try {
          data = await res.json();
        } catch (err) { // res.ok == false
          console.log("HTTP Status: ", res.status);
          console.log("Status Text: ", res.statusText);

        }

        if (res.ok) {
          const { accessToken, userDetail, jwtError, rtError } = data;

          if (accessToken && userDetail) {

            console.log("JWT is regenerated")
            console.log(`Access Token: ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);


            setJsonWebToken(accessToken);
            setJwtIsVerified(true);
            // user and isloggedIn is already set by jwtfetcher top wrapper itself.

          }
          if (jwtError || rtError) { // if jwtError is there, then the RT is revoked in the server itself. (Look at the Backend api)
            // if rtError is there,then there won't be any jwtError - as the former is registered and returned by the server first.

            if (jwtError) {
              console.log(`jwtError: ${jwtError}`);
            }

            if (rtError) {// RT is invalid or RT is not there (due to expiry) or due to manual deletion
              console.log(`rtError: ${rtError}`);
            }
            setIsLoggedIn(false);
            setJsonWebToken(null);
            setUser(null);
          }


        }
      }

      jwtVerify();

    }



  });


  // if it is isLoggedIn==false (Through JwtFetcher), then: Your navbar doesn't show userprofile. Here you can roam freely b/w pages.
  if (!isLoggedIn) {
    return (
      // returns the Outlet of JwtAuthorizedRoutes component. ie; it's children.
      <Outlet />
    );
  }

  // when user tries to enter any of the Outlet's paths, then this JwtAuthorizedRoutes() function will run again and verify with JWT - to let the
  // user pass through or not - to the required path.
  return (

    //Give user data for this util's children
    isLoggedIn && jwtIsVerified ? <Outlet context={user} /> : "loading..."
  );


}

export default JwtAuthorizedRoutes;
