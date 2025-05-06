"use server";
import { cookies } from "next/headers";

const DARK_MODE_KEY = "DARK_MODE";

export const getDarkModeCookie = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const hasDarkModeCookie = cookieStore.has(DARK_MODE_KEY);
  return hasDarkModeCookie
    ? JSON.parse(cookieStore.get(DARK_MODE_KEY)!.value)
    : false;
};

export const setDarkModeCookie = async (value: boolean): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(DARK_MODE_KEY, JSON.stringify(value), { maxAge: 2147483647 });
};
