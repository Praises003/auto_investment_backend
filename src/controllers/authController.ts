// src/controller/userController.ts
import { Request, Response } from "express";
import { registerUserSchema, loginSchema } from "../validators/userValidator";
import { registerUser, loginUser, updateUserProfile   } from "../services/authService";
import { signJwt } from "@/utils/jwt";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const user = await registerUser(validatedData);

    // ✅ Create JWT payload
    const token = signJwt({ userId: user.id });

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message;
    res.status(400).json({ success: false, message });
  }
};



export const loginUserController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(validatedData);

    const token = signJwt({ userId: user.id });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(401).json({ message: "Login failed", error: error.message });
  }
  
};


// src/controllers/userController.ts
// export const updateUserProfileController = async (req: Request, res: Response) => {
//   const userId = (req as any).user?.id;
//   if (!userId) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const updated = await updateUserProfile(userId, req.body);
//     res.status(200).json({ message: "Profile updated", profile: updated });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message || "Error updating profile" });
//   }
// };

export const updateUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profileData = req.body;  

    const updatedProfile = await updateUserProfile(userId, profileData);

    res.status(200).json({
      message: "Profile updated",
      profile: updatedProfile,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
