import { tools, helperPages } from "@/lib/tools";

export const dynamic = "force-static";

export function GET() {
  const base = "https://pngtostl.net";
  const core = [
    ["Homepage", `${base}/`, "Task-first image to STL toolkit homepage with a universal upload entry."],
    ["Image to STL", `${base}/image-to-stl`, "Universal image upload entry for PNG, JPG, WebP, GIF, or BMP with selectable STL workflows."],
    ["Logo to STL", `${base}/logo-to-stl`, "Logo and icon relief STL workflow for badges, signs, and simple graphics."],
    ["Lithophane Generator", `${base}/lithophane-generator`, "Backlit photo lithophane STL generator."],
    ["Heightmap to STL", `${base}/heightmap-to-stl`, "Brightness-to-height STL surface workflow for heightmaps."],
  ];

  const formatEntries = tools
    .filter((tool) => ["png-to-stl", "jpg-to-stl", "convert-image-to-stl"].includes(tool.slug))
    .map((tool) => `- [${tool.title}](${base}/${tool.slug}): ${tool.description}`)
    .join("\n");

  const helpers = helperPages
    .map((page) => `- [${page.title}](${base}/${page.slug}): ${page.description}`)
    .join("\n");

  const body = `# PNGtoSTL

> Browser-first image to STL toolkit for turning common image files into printable STL workflows.

## Core Pages

${core.map(([title, url, description]) => `- [${title}](${url}): ${description}`).join("\n")}

## Format-Specific Starting Points

${formatEntries}

## Guides and Utilities

${helpers}
- [FAQ](${base}/faq): Answers about PNG to STL, image to STL, lithophanes, and realistic 2D-to-3D limits.

## Key Facts

- The universal Image to STL workflow accepts common browser-readable image formats including PNG, JPG, WebP, GIF, and BMP.
- Output is printable STL geometry for reliefs, logos, lithophanes, and heightmaps, not full 3D object reconstruction from a single photo.
- Format-specific pages are retained as SEO entry points and preset defaults, while the homepage promotes task/output workflows.
- STL files do not preserve image colors or textures; they represent geometry.

## Contact

- Website: ${base}

Last updated: 2026-06-06
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
