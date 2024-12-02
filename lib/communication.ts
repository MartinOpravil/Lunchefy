import { HttpResponseCode } from "@/enums";

// Response type
export interface ConvexResponse<T> {
  data: T | null;
  status: HttpResponseCode;
  errorMessage: string | null;
}

// Utility functions
export function createResponse<T>(
  data: T | null,
  status: number,
  errorMessage: string | null
): ConvexResponse<T> {
  return {
    data,
    status,
    errorMessage,
  };
}
export function createOKResponse<T>(data: T) {
  return createResponse(data, HttpResponseCode.OK, null);
}
export function createBadResponse(
  status: HttpResponseCode,
  errorMessage?: string | null
) {
  return createResponse(null, status, errorMessage ?? "");
}
