import type { Response } from "express";

export function createResponse(
  success: boolean,
  data: unknown = null,
  message: string = ""
) {
  return {
    success,
    data,
    message,
  };
}
