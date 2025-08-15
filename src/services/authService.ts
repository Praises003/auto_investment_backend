import { PrismaClient } from '@prisma/client';

type UserProfile = {
    id: string;
    userId: string;
    address: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    postalCode: string | null;
    dob: Date | null;
    employment: string | null;
    annualIncome: number | null;
    institutionName: string | null;
    expectedDeposit: number | null;
    sourceOfFunds: string | null;
    idImage: string | null;
    profession: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
    kycStatus: string;
}


import bcrypt from "bcryptjs";
import { RegisterUserInput, LoginInput } from "../validators/userValidator";
import { v4 as uuid } from "uuid";


const prisma = new PrismaClient();

export const registerUser = async (data: RegisterUserInput) => {
  const { fullName, phoneNumber, email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phoneNumber }] },
  });

  if (existingUser) {
    throw new Error("Email or phone number already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userData = {id: uuid(), phoneNumber, fullName, email, password: passwordHash };

  const user = await prisma.user.create({
    data: userData,
  });

  return user;
};


export const loginUser = async(data: LoginInput) => {
  const {email, password} = data
  const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user

}


// src/services/userService.ts
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {

  return await prisma.userProfile.upsert({
    where: { userId },
    update: profileData,
    create: {
      userId,
      ...profileData,
    },
  });

//   return await prisma.userProfile.upsert({
//   where: { userId },
//   create: {
//     userId,
//     ...profileData, // fields to create if profile doesn't exist
//   },
//   update: {
//     ...profileData, // fields to update if profile exists
//   },
// });



// return await prisma.userProfile.upsert({
//   where: { userId },
//   create: { userId, ...profileData },
//   update: { ...profileData },
// });


};



