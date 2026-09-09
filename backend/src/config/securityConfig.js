const MIN_SECRET_LENGTH = 32;

export const validateSecurityConfig = () => {
  const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    NODE_ENV,
  } = process.env;

  if (!JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  if (JWT_ACCESS_SECRET === JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different"
    );
  }

  if (
    NODE_ENV === "production" &&
    JWT_ACCESS_SECRET.length < MIN_SECRET_LENGTH
  ) {
    throw new Error(
      "JWT_ACCESS_SECRET must contain at least 32 characters in production"
    );
  }

  if (
    NODE_ENV === "production" &&
    JWT_REFRESH_SECRET.length < MIN_SECRET_LENGTH
  ) {
    throw new Error(
      "JWT_REFRESH_SECRET must contain at least 32 characters in production"
    );
  }
};