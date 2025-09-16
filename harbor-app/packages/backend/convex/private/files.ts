import {
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
} from "@convex-dev/rag";
import { ConvexError, v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { action, mutation, query } from "../_generated/server";

/**
 * Guess the mime type of a file. Uses RAG to guess the mime type of a file.
 *
 * @param filename - The filename of the file
 * @param bytes - The bytes of the file
 * @returns The mime type of the file
 */
function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

/**
 * Delete a file from the storage
 *
 * @param storageId - The storage id of the file
 */
export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    await ctx.storage.delete(args.storageId as Id<"_storage">);
  },
});

/**
 * Add a file to the storage
 *
 * You should use this action to add a file to the storage.
 * This action will return the url of the file that you can use to access the file.
 *
 * @example
 *
 * ```ts
 * const url = await ctx.runAction(internal.files.addFile, {
 *   filename: "example.txt",
 *   mimeType: "text/plain",
 *   bytes: new Blob(["Hello, world!"]).arrayBuffer(),
 * });
 * ```
 *
 * @category private
 * @param args - The arguments for the action
 * @param args.filename - The filename of the file
 * @param args.mimeType - The mime type of the file
 * @param args.bytes - The bytes of the file
 *
 * @returns The url of the file
 */
export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if the user is authorized to add a file in the category
    // TODO: Check if the user is team or admin
    const { bytes, filename } = args;

    const mimeType = args.mimeType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    if (!storageId) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Failed to store file",
      });
    }

    return {
      url: await ctx.storage.getUrl(storageId),
    };
  },
});

/**
 * Generate a upload url for a file
 *
 * @returns The upload url
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});
