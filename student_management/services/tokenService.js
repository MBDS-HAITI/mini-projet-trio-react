exports.refreshIfNeeded = async (user) => {
  if (Date.now() < user.tokenExpiry) return user.accessToken;

  oauth2Client.setCredentials({
    refresh_token: decrypt(user.refreshToken)
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  user.accessToken = credentials.access_token;
  user.tokenExpiry = Date.now() + credentials.expires_in * 1000;
  await user.save();

  return user.accessToken;
};
