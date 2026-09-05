export function serializeUser(userDoc) {
  if (!userDoc) return null;
  const user =
    typeof userDoc.toObject === "function" ? userDoc.toObject() : userDoc;

  return {
    ...user,
    _id: user._id?.toString(),
    tenantId: user.tenantId?.toString(),
    following: user.following?.map((id) => id.toString()) || [],
    savedBlogs: user.savedBlogs?.map((id) => id.toString()) || [],
    repostedBlogs: user.repostedBlogs?.map((id) => id.toString()) || [],
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}
