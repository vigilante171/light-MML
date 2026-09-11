import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';

const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  referralCode,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  let sponsor = null;
  if (referralCode) {
    sponsor = await User.findOne({
      referralCode: referralCode.toUpperCase().trim(),
      isActive: true,
    });

    if (!sponsor) {
      throw new Error("Invalid referral code");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const generatedReferralCode = `${firstName}${lastName}${Date.now()}`
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password: hashedPassword,
    referralCode: generatedReferralCode,
    sponsor: sponsor ? sponsor._id : null,
  });

  // ✅ Correct placement: no stray characters
  await createReferralForUser(user);

  return user;
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

  return user;
};
