import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const { userId, getToken } = await auth();
  if (!userId) {
    console.log("User is logged out");
    redirect("/sign-in?loggedOut=true");
  }

  try {
    const token = await getToken({ template: "convex" });
    return token ?? undefined;
  } catch (error) {
    console.log("Error when trying to retrieve a token");
    redirect("/sign-in?loggedOut=true");
  }
}
