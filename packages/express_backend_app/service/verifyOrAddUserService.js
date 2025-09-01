exports.verifyOrAddUserService = async (userPayload, searchUser, userAddReturn, updatePicture) => {


  let userDetail = await searchUser(userPayload);
  if (!userDetail.length) {
    userDetail = await userAddReturn(userPayload);
    return userDetail[0];
  } else {
    //Update the profile picture link from Google
    await updatePicture(userPayload);
  }
  return userDetail[0];
}
