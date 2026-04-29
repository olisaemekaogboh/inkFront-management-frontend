import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("public/images/portfolio");

const items = [
  ["edubridge-homepage.webp", "fictional school management platform homepage dashboard"],
  ["quickship-homepage.webp", "fictional logistics delivery dashboard homepage"],
  ["halamart-homepage.webp", "fictional multi vendor marketplace homepage"],
  ["payswift-homepage.webp", "fictional fintech wallet bill payment app homepage"],
  ["propertyfinder-homepage.webp", "fictional real estate listing website homepage"],
  ["bloommusic-homepage.webp", "fictional music streaming platform homepage"],
  ["medicare-homepage.webp", "fictional hospital facility management dashboard homepage"],
  ["savewise-homepage.webp", "fictional savings investment finance app homepage"],
  ["farmconnect-homepage.webp", "fictional agritech marketplace homepage"],
  ["skillbridge-homepage.webp", "fictional online learning platform homepage"],
  ["eventwave-homepage.webp", "fictional event ticketing platform homepage"],
  ["churchflow-homepage.webp", "fictional church management platform homepage"],
];

await fs.mkdir(outputDir, { recursive: true });

for (const [fileName, prompt] of items) {
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${prompt}, premium modern web UI mockup, clean homepage screen, no real logos, no copyrighted brand, no people`
  )}?width=1200&height=750&nologo=true`;

  try {
    console.log(`Downloading: ${fileName}`);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.log(`Failed: ${fileName} - ${response.status}`);
      continue;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(path.join(outputDir, fileName), buffer);

    console.log(`Saved: ${fileName}`);
  } catch (error) {
    console.log(`Error saving ${fileName}: ${error.message}`);
  }
}

console.log("Done.");