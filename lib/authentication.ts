import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const session = auth();
  if (!session.userId) {
    console.log("User is logged out");
    redirect("/sign-in?loggedOut=true");
  }

  try {
    const result = await session.getToken({ template: "convex" });
    return result ?? undefined;
  } catch (error) {
    console.log("Error when trying to retrieve a token");
    redirect("/sign-in?loggedOut=true");
  }
}
