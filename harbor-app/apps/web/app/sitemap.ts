import type { MetadataRoute } from "next";

export const baseUrl = "https://www.harborpartners.pt/"; // TODO: change to the correct base url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));
  return [...routes];
}
