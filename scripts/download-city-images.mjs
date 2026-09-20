// Prepare local city photographs and preserve Wikimedia attribution/license metadata.
// This is a development-only utility; the application never calls Wikipedia.
import { mkdir, writeFile } from "node:fs/promises";

const cityPages = {
  medellin: "Medellín",
  cartagena: "Cartagena, Colombia",
  bogota: "Bogotá",
  "santa-marta": "Santa Marta",
  paris: "Paris",
  lyon: "Lyon",
  nice: "Nice",
  bordeaux: "Bordeaux",
  rome: "Rome",
  florence: "Florence",
  venice: "Venice",
  positano: "Positano",
  tokyo: "Tokyo",
  kyoto: "Kyoto",
  osaka: "Osaka",
  hiroshima: "Hiroshima",
  barcelona: "Barcelona",
  madrid: "Madrid",
  seville: "Seville",
  valencia: "Valencia",
  athens: "Athens",
  santorini: "Santorini",
  chania: "Chania",
  naxos: "Naxos (city)",
};
const headers = {
  "User-Agent": "RoamDemo/0.1 (local frontend prototype; asset preparation)",
};
async function query(host, params) {
  const url = new URL(`https://${host}/w/api.php`);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    ...params,
  }).toString();
  const response = await fetch(url, { headers });
  if (!response.ok)
    throw new Error(`Metadata request failed: ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return Object.values(data.query.pages);
}
function plainText(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const pages = await query("en.wikipedia.org", {
  prop: "pageimages",
  piprop: "name",
  titles: Object.values(cityPages).join("|"),
});
// The article lead image is a municipal map; use a photograph from its gallery.
pages.find((page) => page.title === "Santorini").pageimage =
  "Imerovigli 02.jpg";
const files = await query("commons.wikimedia.org", {
  prop: "imageinfo",
  iiprop: "url|extmetadata|mime",
  iiurlwidth: "1000",
  titles: pages.map((page) => `File:${page.pageimage}`).join("|"),
});
const metadata = [];
const output = new URL("../public/images/cities/", import.meta.url);
await mkdir(output, { recursive: true });
for (const [id, title] of Object.entries(cityPages)) {
  const page = pages.find((item) => item.title === title);
  const info = files.find(
    (file) => file.title === `File:${page?.pageimage?.replaceAll("_", " ")}`,
  )?.imageinfo?.[0];
  if (!info?.thumburl || !info.extmetadata.LicenseShortName?.value)
    throw new Error(`Missing image or license metadata for ${title}`);
  const license = plainText(info.extmetadata.LicenseShortName.value);
  if (!/CC BY|CC0|Public domain/i.test(license))
    throw new Error(`Review license before use: ${title}: ${license}`);
  const response = await fetch(info.thumburl, { headers });
  if (!response.ok)
    throw new Error(`Photo request failed: ${title} (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const extension =
    bytes[0] === 255 && bytes[1] === 216
      ? "jpg"
      : bytes[0] === 137 && bytes[1] === 80
        ? "png"
        : undefined;
  if (!extension) throw new Error(`Unsupported photo format for ${title}`);
  await writeFile(new URL(`${id}.${extension}`, output), bytes);
  metadata.push({
    cityId: id,
    src: `/images/cities/${id}.${extension}`,
    alt: `Architectural and city views of ${title}`,
    caption: `${title} · city inspiration`,
    source: info.descriptionurl,
    credit: plainText(
      info.extmetadata.Artist?.value || info.extmetadata.Credit?.value,
    ),
    license,
    licenseUrl: info.extmetadata.LicenseUrl?.value || info.descriptionurl,
  });
  console.log(`${id}: ${license}, ${Math.round(bytes.length / 1024)} KB`);
}
await writeFile(
  new URL("../src/data/city-images.json", import.meta.url),
  `${JSON.stringify(metadata, null, 2)}\n`,
);
const credits = [
  "# City photography credits",
  "",
  "These Wikimedia Commons images are stored locally. Each row links to the original file page, creator attribution, and reuse license. Assets are resized thumbnails; display crops are applied by CSS. Activity cards reuse their city image as labeled city inspiration, not as a photograph of the activity.",
  "",
  "| Asset | Creator | License | Source |",
  "| --- | --- | --- | --- |",
  ...metadata.map(
    (image) =>
      `| ${image.src} | ${image.credit.replaceAll("|", "/")} | [${image.license}](${image.licenseUrl}) | [Original file](${image.source}) |`,
  ),
  "",
];
await writeFile(new URL("CREDITS.md", output), credits.join("\n"));
