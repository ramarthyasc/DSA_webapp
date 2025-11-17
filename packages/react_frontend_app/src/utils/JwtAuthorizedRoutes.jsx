import { useOutletContext } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { ErrorContext } from '../context/ErrorContext';

//NOTE: ANY ROUTE/PATH CHANGE IS DONE, THEN REACT GOES THROUGH THIS COMPONENT FIRST.
//
// This component is only reached after JwtFetcher. So if isLoggedIn==true, then all other states will be true( jsonWebToken, etc..)
// OR YOU CAN USE A LOADER TO VERIFY JWT FOR THE ROUTES> new Feature
function JwtAuthorizedRoutes() {
  console.log("JwtAuthorizedRoutes");
  const [isLoggedIn, setIsLoggedIn, jsonWebToken, setJsonWebToken, setUser, user] = useOutletContext();
  const setError = useContext(ErrorContext);

  // NOTE: When a <Link> is clicked, in that moment, the location is changed (pushed to stack). The react router walks through the route-tree from root
  // to the parent component who has the outlet as the new component of the new path. Here, the outlet only is rendered. That's it - to increase
  // Performance - in REACT ROUTER V6+.
  //
  //But we need this component to run whenever route changes - verify JWT. So we use useLocation here. To Trigger run this component on Route change.
  //So useLocation state is triggered and the component using the useLocation hook rerenders just when you click the <Link> itself.
  const location = useLocation();

  const jwtIsVerifiedRef = useRef(false);


  useLayoutEffect(() => {
    jwtIsVerifiedRef.current = false;
  }, [location.pathname]);




  // DO THIS WHEN THE USER TRIES TO GO TO ANY PATH IN THE WEBSITE.
  // if there was no refresh token send to server (as due to expiry) - then server sends rtError.
  // if there was an invalid (revoked/expired/different) refresh token send to server (Hacker) - then server sends a different valued rtError.
  useEffect(() => {

    if (isLoggedIn && !jwtIsVerifiedRef.current) {

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
        } catch (err) { // res.ok == false - unknown HTTP ERROR (We will see "loading..." here) If any, then we have to fix it. Not a developer designed error from server.
          console.log("HTTP Status: ", res.status);
          console.log("Status Text: ", res.statusText);
          return;

        }

        if (res.ok) {
          const { accessToken, userDetail, jwtError, rtError } = data;

          if (accessToken && userDetail) {

            console.log("JWT is verified & regenerated from the server before going to a secure route")
            //console.log(`Access Token: ${accessToken}, User Detail: ${JSON.stringify(userDetail)}`);


            setJsonWebToken(accessToken);
            setIsLoggedIn(true);
            setUser(userDetail);
            jwtIsVerifiedRef.current = true;
            // user and isloggedIn is already set by jwtfetcher top wrapper itself. So doesn't matter if give it or not. But good pattern to give it.

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
            setError(true);
          }


        }
      }

      jwtVerify();

    }



  });

  //NOTE: DYNAMIC RENDERS ARE RETURNED HERE & useEffects have Await in it> So this component's useEffects have to run here itself.

  // For isLoggedIn === false, the useEffects won't run, so you can return the DYNAMIC RENDER directly.
  // if it is isLoggedIn==false (Through JwtFetcher), then: Your navbar doesn't show userprofile. Here you can roam freely b/w pages.
  if (!isLoggedIn) {
    return (
      // returns the Outlet of JwtAuthorizedRoutes component. ie; it's children.
      <Outlet />
    );
  }

  // when user tries to enter any of the Outlet's paths, then this JwtAuthorizedRoutes() function will run again and verify with JWT - to let the
  // user pass through or not - to the required path.

  if (isLoggedIn) {
    if (jwtIsVerifiedRef.current) { return <Outlet context={user} /> }

    return "loading";
  }


}

export default JwtAuthorizedRoutes;
