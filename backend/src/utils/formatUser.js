// Prisma returns plain objects (no Mongoose document methods like
// toSafeObject()), so the "strip the password" step is now an explicit
// utility function used everywhere a user is returned to the client.
const formatUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

module.exports = formatUser;
