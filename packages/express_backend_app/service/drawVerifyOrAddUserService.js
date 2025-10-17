exports.verifyOrAddUserService = async (userPayload, searchUser, userAddReturn, updatePicture, fs, path) => {


  let userDetail = await searchUser(userPayload);

  //save picture locally
  let response;
  try {
    response = await fetch(userPayload.picture);
    const arrayBuffer = await response.arrayBuffer(); // convert to arrayBuffer
    const buffer = Buffer.from(arrayBuffer); // convert to node Buffer ie; bytes of the image

    const savePath = path.join(__dirname, "../public/proPic/", userPayload.sub + ".jpg");
    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(savePath, buffer);

    //change the picture link in userDetail to image name
    userPayload.picture = userPayload.sub + ".jpg";

  } catch (err) {
    console.error(err);
  }

  if (!userDetail.length) {
    userDetail = await userAddReturn(userPayload);
    return userDetail[0];
  } else {

    //Update the profile picture link from local storage
    await updatePicture(userPayload);
  }
  return userDetail[0];
}
