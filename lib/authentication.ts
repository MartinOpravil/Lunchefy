import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const { userId, getToken, sessionId } = await auth();

  try {
    const token = await getToken({ template: "convex" });
    // console.log("token: ", token);
    if (!token) {
      console.log("No token available, redirecting to sign-in...");
      redirect("/sign-in?loggedOut=true");
    }

    return token;
  } catch (error) {
    console.error(
      "Error retrieving token (error, userId, sessionId):",
      error,
      userId,
      sessionId
    );
    redirect("/sign-in?loggedOut=true");
  }
}
