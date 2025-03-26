import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const { userId, getToken } = await auth();

  try {
    const token = await getToken({ template: "convex" });

    if (!token) {
      console.log("No token available, redirecting to sign-in...");
      redirect("/sign-in?loggedOut=true");
    }

    return token;
  } catch (error) {
    console.log("Error retrieving token:", error);
    redirect("/sign-in?loggedOut=true");
  }
}
