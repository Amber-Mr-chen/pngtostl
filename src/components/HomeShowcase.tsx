import Image from "next/image";
import Link from "next/link";

const samples = [
  {
    id: "logo",
    label: "Logo relief",
    title: "Clean logo relief",
    href: "/logo-to-stl",
    sourceLabel: "Transparent PNG logo",
    previewLabel: "Raised badge STL",
    description: "Use high-contrast transparent artwork when you want a crisp raised sign, badge, maker mark, or product logo.",
    metrics: "17,940 triangles · 897 KB STL",
    size: "95 mm badge",
    sourceImage: "/samples/logo-badge-source.png",
    previewImage: "/samples/logo-badge-preview.png",
  },
  {
    id: "photo",
    label: "Lithophane",
    title: "Backlit photo lithophane",
    href: "/lithophane-generator",
    sourceLabel: "Portrait-style photo",
    previewLabel: "Thin backlit panel",
    description: "Use a portrait or balanced photo when the print should reveal detail under light instead of behaving like a normal relief.",
    metrics: "65,532 triangles · 3.1 MB STL",
    size: "0.8–3.2 mm thickness",
    sourceImage: "/samples/lithophane-panel-source.png",
    previewImage: "/samples/lithophane-panel-preview.png",
  },
  {
    id: "heightmap",
    label: "Heightmap",
    title: "Heightmap surface",
    href: "/heightmap-to-stl",
    sourceLabel: "Grayscale height map",
    previewLabel: "Terrain-like STL surface",
    description: "Use a black-to-white depth map when brightness should become physical surface height for terrain, texture, or relief plates.",
    metrics: "65,532 triangles · 3.1 MB STL",
    size: "120 mm surface",
    sourceImage: "/samples/heightmap-surface-source.png",
    previewImage: "/samples/heightmap-surface-preview.png",
  },
];

export function ShowcaseDemo() {
  return (
    <section className="showcaseBlock naturalShowcase" aria-label="Real image to STL workflow examples">
      <div className="showcaseHeader naturalShowcaseHeader">
        <p className="homeKicker">Real workflow examples</p>
        <h2>Choose the output that matches your print.</h2>
        <p>
          Each example shows the actual input image next to the generated STL preview, with the settings style and expected mesh size.
        </p>
      </div>

      <div className="naturalWorkflowGrid">
        {samples.map((sample) => (
          <article key={sample.id} className={`naturalWorkflowCard ${sample.id}`}>
            <div className="naturalWorkflowVisual" aria-hidden="true">
              <div className="naturalImagePane inputPane">
                <span>{sample.sourceLabel}</span>
                <Image src={sample.sourceImage} alt="" width={320} height={320} loading="lazy" />
              </div>
              <div className="naturalArrow">→</div>
              <div className="naturalImagePane previewPane">
                <span>{sample.previewLabel}</span>
                <Image src={sample.previewImage} alt="" width={720} height={492} loading="lazy" />
              </div>
            </div>

            <div className="naturalWorkflowCopy">
              <div>
                <p>{sample.label}</p>
                <h3>{sample.title}</h3>
              </div>
              <p>{sample.description}</p>
              <dl>
                <div>
                  <dt>Output</dt>
                  <dd>{sample.size}</dd>
                </div>
                <div>
                  <dt>Mesh</dt>
                  <dd>{sample.metrics}</dd>
                </div>
              </dl>
              <Link href={sample.href}>Open this workflow</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="naturalShowcaseFooter">
        <Link href="/samples">View all examples</Link>
        <span>Samples use real source images, generated STL downloads, and matching mesh metrics.</span>
      </div>
    </section>
  );
}

const miniExamples = {
  relief: [18, 42, 68, 34, 82, 58, 28, 74],
  litho: [72, 44, 30, 62, 84, 56, 38, 66],
  plan: [36, 54, 76, 48, 62, 30, 70, 52],
};

export function MiniToolExample({ type }: { type: keyof typeof miniExamples }) {
  const bars = miniExamples[type];
  return (
    <div className={`miniExample ${type}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={`${type}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
      ))}
    </div>
  );
}
