function Userin({ setIsLoggedIn, user }) {
  return (

    <>
      <ul>
        <li>{user.name}</li>
        <li><img src={user.picture} alt="profile-picture" /></li>
      </ul>
    </>
  )
}

export default Userin;
