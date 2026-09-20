// One-time asset preparation. The application serves the checked-in files locally.
import { mkdir, writeFile } from "node:fs/promises";

const photos = {
  colombia: "1536308037887-165852797016",
  france: "1502602898657-3e91760cbb34",
  italy: "1516483638261-f4dbaf036963",
  japan: "1493976040374-85c8e12f0c0e",
  spain: "1539037116277-4db20889f2d4",
  greece: "1613395877344-13d4a8e0d49e",
};
const output = new URL("../public/images/", import.meta.url);
await mkdir(output, { recursive: true });
await Promise.all(
  Object.entries(photos).map(async ([country, photo]) => {
    const response = await fetch(
      `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1200&q=82&fm=jpg`,
    );
    if (
      !response.ok ||
      !response.headers.get("content-type")?.startsWith("image/")
    )
      throw new Error(`Image download failed: ${country} (${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(new URL(`${country}.jpg`, output), bytes);
    console.log(`${country}.jpg: ${Math.round(bytes.length / 1024)} KB`);
  }),
);
