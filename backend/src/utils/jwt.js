import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
  );

  if (
    typeof decoded !== "object" ||
    !decoded.userId
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded;
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  if (
    typeof decoded !== "object" ||
    !decoded.userId
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
};