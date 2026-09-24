// Reproduce the curated, reviewed activity photo manifest. No runtime network calls.
import { mkdir, writeFile } from "node:fs/promises";
import photos from "../src/data/activity-images.json" with { type: "json" };
const output = new URL("../public/images/activities/", import.meta.url);
await mkdir(output, { recursive: true });
const headers = {
  "User-Agent": "RoamDemo/0.1 (local frontend asset preparation)",
};
async function request(url, attempt = 0) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 429 && attempt < 4) {
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        Math.max(
          10000,
          Number(response.headers.get("retry-after") || 10) * 1000,
        ),
      ),
    );
    return request(url, attempt + 1);
  }
  if (!response.ok) throw new Error("Photo request failed: " + response.status);
  return response;
}
for (let index = 0; index < photos.length; index += 20) {
  const batch = photos.slice(index, index + 20);
  const titles = batch.map((p) =>
    decodeURIComponent(
      new URL(p.source).pathname.split("/wiki/")[1],
    ).replaceAll("_", " "),
  );
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "800",
  });
  const data = await (await request(url)).json();
  for (const photo of batch) {
    const title = decodeURIComponent(
      new URL(photo.source).pathname.split("/wiki/")[1],
    ).replaceAll("_", " ");
    const info = Object.values(data.query.pages).find((p) => p.title === title)
      ?.imageinfo?.[0];
    if (!info?.thumburl) throw new Error("Missing source: " + photo.activityId);
    const bytes = Buffer.from(
      await (await request(info.thumburl)).arrayBuffer(),
    );
    if (!(
      (bytes[0] === 255 && bytes[1] === 216) ||
      (bytes[0] === 137 && bytes[1] === 80)
    ))
      throw new Error("Invalid photo: " + photo.activityId);
    await writeFile(new URL(photo.src.split("/").pop(), output), bytes);
    console.log(photo.activityId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
