"use server";

import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  console.log("got the user details");
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    console.log("Checked the details");
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please Sign in instead",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    console.log("Succesfully created data");
    return {
      success: true,
      message: "You have successfully created the account",
    };
  } catch (e) {
    console.error("Error Creating a user:", e);
    return {
      success: false,
      message: "Error creating user",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  console.log("Got the data from the user");
  try {
    const userRecord = await auth.getUserByEmail(email);
    console.log("Checked the user data");
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    await setSessionCookie(idToken);
    console.log("Session assigned");
    return {
      success: true,
      message: "Successfully signed in",
    };
  } catch (e) {
    console.error("Error signing in:", e);
    return {
      success: false,
      message: "Failed to login to the account",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });
  console.log("Session function called");
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore= await cookies();
    const sessionCookie= cookieStore.get('session')?.value;
    if(!sessionCookie) return null;
    try{
        const decodedClaims=await auth.verifySessionCookie(sessionCookie,true);
        const userRecord=await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists) return null;
        return{
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    }catch(e){
        console.log(e);
    }
    return null;
}

export async function isAuthenticated(){
    const user= await getCurrentUser();
    return !!user;
}

