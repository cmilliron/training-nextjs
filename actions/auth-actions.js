"use server";
import { createUser, getUserByEmail } from "@/lib/user";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { redirect } from "next/navigation";
import { createAuthSession } from "@/lib/auth";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedUserPassword = hashUserPassword(password);
  try {
    const userId = createUser(email, hashedUserPassword);
    await createAuthSession(userId);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email:
            "it seems like an account for the chosen email already exists.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  console.log(existingUser);
  if (!existingUser) {
    console.log("error");
    return {
      errors: {
        email: "Could not authenticate user. Please check your credentials",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);
  console.log(isValidPassword);
  if (!isValidPassword) {
    console.log("error");
    return {
      errors: {
        password: "Could not authenticate user. Please check your credentials",
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }

  return signup(prevState, formData);
}
