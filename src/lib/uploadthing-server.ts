import { UTApi } from "uploadthing/server";
import { env } from "./env";

const utApi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});

/**
 * Extract the file key from an uploadthing URL
 * Supports formats like:
 * - https://utfs.io/f/{fileKey}
 * - Just the fileKey itself
 */
function extractFileKey(url: string): string | null {
  try {
    // If it looks like a file key already (no protocol), return it
    if (!url.includes("://")) {
      return url;
    }

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter((part) => part);

    // Get the last part which should be the file key
    return pathParts.at(-1) ?? null;
  } catch {
    return null;
  }
}

/**
 * Delete a file from uploadthing
 * @param fileUrl - The full URL or file key of the file to delete
 * @returns true if deletion was successful, false otherwise
 */
export async function deleteFromUploadthing(fileUrl: string): Promise<boolean> {
  try {
    const fileKey = extractFileKey(fileUrl);

    if (!fileKey) {
      return false;
    }

    // Use UTApi to delete the file (deleteFiles accepts an array)
    const result = await utApi.deleteFiles([fileKey]);

    // Check if deletion was successful
    return result.success === true;
  } catch {
    return false;
  }
}
