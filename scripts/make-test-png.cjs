const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const { encode } = await import("fast-png");
  const width = 8;
  const height = 8;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const value = Math.round(((x + y) / 14) * 255);
      data[index] = value;
      data[index + 1] = 255 - value;
      data[index + 2] = Math.round((x / 7) * 255);
      data[index + 3] = 255;
    }
  }

  const outputDir = path.join(process.cwd(), "tmp");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "test.png"), Buffer.from(encode({ width, height, data, channels: 4 })));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
