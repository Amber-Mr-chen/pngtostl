import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { BrandMark } from "@/components/BrandMark";
import { ConverterPanel } from "@/components/ConverterPanel";
import { LazyVideo } from "@/components/LazyVideo";
import { tools } from "@/lib/tools";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        "auto-rotate"?: boolean | string;
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "camera-target"?: string;
        "field-of-view"?: string;
        "interaction-prompt"?: string;
        "disable-zoom"?: boolean | string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        exposure?: string;
      };
    }
  }
}

const quickBenefits = [
  { title: "Private preview flow", copy: "Check the conversion route before downloading, with clear guidance for every image type." },
  { title: "Real STL workflows", copy: "Route logos, photos, icons, and maps into relief, lithophane, or heightmap-style outputs." },
  { title: "Print-focused defaults", copy: "Use practical thickness, detail, and smoothing presets designed for common slicers." },
];

const trustStats = [
  { label: "Supported formats", value: "PNG · JPG · WebP · GIF · BMP" },
  { label: "Best first use", value: "Logos, icons, photos, terrain" },
  { label: "Output target", value: "STL for 3D printing" },
];

const aboutPoints = [
  "Transform 2D images into raised STL reliefs, panels, and printable surfaces.",
  "Use guided routing to choose the safest workflow for logos, photos, and artwork.",
  "Preview before downloading so you can avoid wasted prints and wrong expectations.",
];

const aboutFlow = [
  { step: "01", title: "Upload", copy: "Drop in PNG, JPG, or WebP artwork." },
  { step: "02", title: "Route", copy: "Choose relief, lithophane, logo, or heightmap." },
  { step: "03", title: "Preview", copy: "Check the STL direction before export." },
];

const steps = [
  { step: "01", title: "Upload image", copy: "Choose PNG, JPG, WebP, GIF, or BMP." },
  { step: "02", title: "Analyze image", copy: "The tool checks contrast, outlines, and shape fit." },
  { step: "03", title: "Generate STL", copy: "Create a printable mesh with practical defaults." },
  { step: "04", title: "Download model", copy: "Export your STL and open it in your slicer." },
];

const featureCards = [
  { title: "High-resolution STL files", copy: "Keep edges and relief detail readable for badges, signs, and panels." },
  { title: "Fast conversion processing", copy: "A streamlined flow keeps upload, preview, and download close together." },
  { title: "3D model preview", copy: "Review the expected model route before committing to a full conversion." },
  { title: "Customizable STL settings", copy: "Control speed and detail presets for different image types." },
  { title: "Cloud-ready workflow", copy: "Designed for browser-based makers, educators, and small studios." },
  { title: "Print-focused routing", copy: "Prefer reliable relief geometry over unrealistic full-3D promises." },
];

type ShowcaseCard = {
  title: string;
  copy: string;
  image: string;
  video?: string;
  alt: string;
  model?: string;
  variant?: "temple";
  sourceUrl?: string;
  sourceLabel?: string;
};

const showcase: ShowcaseCard[] = [
  {
    title: "Historic Architecture",
    copy: "A landmark building is turned into a clean 3D model preview while preserving arches, towers, and base geometry.",
    image: "/samples/showcase-unified-charminar-hyderabad.webp",
    video: "/samples/showcase-turntable-charminar-hyderabad.mp4",
    alt: "CGTrader free CHARMINAR Hyderabad historic exterior 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/exterior/historic-exterior/charminar-hyderabad",
    sourceLabel: "Free model · Royalty Free License (no AI)",
  },
  {
    title: "Sci-Fi Armor",
    copy: "A red-and-gold armor reference becomes a detailed 3D showcase for mechanical layers and hard-surface forms.",
    image: "/samples/showcase-unified-ironman-suit.webp",
    video: "/samples/showcase-turntable-ironman-suit.mp4",
    alt: "CGTrader free Ironman suit sci-fi character 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/character/sci-fi-character/free-ironman-suit-graphics",
    sourceLabel: "Free model · Royalty Free License (no AI)",
  },
  {
    title: "Sports Car Design",
    copy: "A classic coupe silhouette is converted into a visual 3D model with body curves, headlights, and wheel detail.",
    image: "/samples/showcase-unified-porsche-911-turbo.webp",
    video: "/samples/showcase-turntable-porsche-911-turbo.mp4",
    alt: "CGTrader free 2016 Porsche 911 Turbo low-poly 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/car/sport-car/2016-porsche-911-turbo",
    sourceLabel: "Free model · Editorial License (no AI)",
  },
  {
    title: "Character Outfit",
    copy: "A fashion character reference is translated into a 3D display model with readable clothing cuts and pose.",
    image: "/samples/showcase-unified-female-outfit.webp",
    video: "/samples/showcase-turntable-female-outfit.mp4",
    alt: "CGTrader free female outfit character clothing 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/character/clothing/female-outfit-0c1fe51c-de60-45a3-9cd9-2c5ee2d8cfde",
    sourceLabel: "Free model · Royalty Free License (no AI)",
  },
  {
    title: "Toy Character",
    copy: "A cute collectible-style character becomes a polished 3D preview with big eyes, antlers, and soft pink material.",
    image: "/samples/showcase-unified-deepink-funko-jellykid.webp",
    video: "/samples/showcase-turntable-deepink-funko-jellykid.mp4",
    alt: "CGTrader free DeePink Funko JellyKid toy character 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/animal/mammal/deepink-funko-jellykid",
    sourceLabel: "Free model · Royalty Free License (no AI)",
  },
  {
    title: "Electronics Product",
    copy: "Retro wired headphones are presented as a clear 3D model preview with ear cups, headband, and cable structure.",
    image: "/samples/showcase-unified-retro-wired-headphones.webp",
    video: "/samples/showcase-turntable-retro-wired-headphones.mp4",
    alt: "CGTrader free stylized retro wired headphones high-poly 3D model preview",
    sourceUrl: "https://www.cgtrader.com/free-3d-models/electronics/audio/stylized-retro-wired-headphones-high-poly-3d-model",
    sourceLabel: "Free model · Royalty Free License (no AI)",
  },
];

const pricingPlans = [
  {
    name: "Free",
    oldPrice: "",
    price: "$0",
    period: "now",
    copy: "For no-signup single-file conversion today.",
    features: ["Single image upload", "Preview workflow", "STL download", "PNG/JPG/WebP/GIF/BMP support"],
  },
  {
    name: "Pro",
    oldPrice: "",
    price: "Planned",
    period: "",
    featured: true,
    copy: "For higher limits after real usage demand is confirmed.",
    features: ["Higher practical limits", "Saved defaults", "More detail controls", "No payment collected yet"],
  },
  {
    name: "Batch/API",
    oldPrice: "",
    price: "By request",
    period: "",
    copy: "For schools, shops, teams, and workflow integrations.",
    features: ["Batch conversion interest", "API access planning", "Commercial workflow support", "Contact before launch"],
  },
];

const faqs = [
  { q: "What is image to STL conversion?", a: "It turns a flat image into STL geometry for 3D printing, usually as a raised relief, panel, lithophane, or depth surface." },
  { q: "Which image formats are supported?", a: "PNG, JPG, WebP, GIF, and BMP are supported. Transparent PNG files work especially well for logos and badges." },
  { q: "Can I convert a photo to STL?", a: "Yes. Photos usually work best as lithophanes, relief panels, or depth-style surfaces rather than full free-standing objects." },
  { q: "Is PNGtoSTL free to preview?", a: "You can preview the likely STL workflow first, so you can check whether the image is suitable before spending time on export." },
  { q: "Can photos become full 3D objects?", a: "Most photos work best as relief or lithophane-style models. The tool prioritizes printable results instead of unrealistic full-3D claims." },
  { q: "Does it create a real 360° 3D model from one image?", a: "A single image usually cannot define every hidden side. PNGtoSTL focuses on reliable printable STL workflows such as extrusion, relief, lithophane, and heightmap output." },
  { q: "Do I need CAD software?", a: "No. Upload an image, choose a preset, preview the route, then download an STL for your slicer." },
  { q: "Is the STL ready for 3D printing?", a: "The output is designed for common slicer workflows, with print-focused geometry and practical defaults." },
  { q: "Can I use the model commercially?", a: "You can use generated files for maker projects, prototypes, or commercial print workflows when you have the rights to the source image and the output fits your use case." },
];

const relatedToolSlugs = ["image-to-stl", "png-to-stl", "jpg-to-stl", "logo-to-stl", "photo-to-stl", "lithophane-generator", "heightmap-to-stl", "svg-to-stl"];

const relatedToolLabels: Record<string, string> = {
  "image-to-stl": "Image to STL",
  "png-to-stl": "PNG to STL",
  "jpg-to-stl": "JPG to STL",
  "logo-to-stl": "Logo to STL",
  "photo-to-stl": "Photo to STL",
  "lithophane-generator": "Lithophane Maker",
  "heightmap-to-stl": "Heightmap to STL",
  "svg-to-stl": "SVG to STL",
};

function findTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

function IconMark() {
  return (
    <span className="refIcon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function WireSphere() {
  return (
    <div className="refWireSphere" aria-hidden="true">
      <svg viewBox="0 0 360 260" fill="none">
        <path d="M90 133c0-48 39-87 87-87s87 39 87 87-39 87-87 87-87-39-87-87Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M116 75c41 19 84 19 126 0M116 191c41-19 84-19 126 0M177 47c28 28 42 57 42 86s-14 58-42 86M177 47c-28 28-42 57-42 86s14 58 42 86" stroke="currentColor" strokeWidth="1" />
        <path d="M91 133h173M177 47v173" stroke="currentColor" strokeWidth="0.9" />
        <path d="M39 217c75-35 154-52 237-48M70 36c70 24 140 24 210 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
      </svg>
    </div>
  );
}

const pageUrl = "https://pngtostl.net";

function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PNGtoSTL",
      url: pageUrl,
      description: "Convert PNG, JPG, WebP, GIF, or BMP images into printable STL workflows for logos, reliefs, lithophanes, and heightmaps.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${pageUrl}/image-to-stl?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PNGtoSTL Image to STL Converter",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: pageUrl,
      description: "Browser-based image to STL converter for creating printable relief STL files, logo badges, lithophanes, and heightmap surfaces from common image formats.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "PNG to STL logo badge workflow",
        "JPG and photo to STL relief workflow",
        "Lithophane panel routing",
        "Heightmap-style STL output",
        "Printable STL preview and download",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to convert an image to STL",
      description: "Upload an image, choose the safest STL workflow, generate a printable mesh, and download the STL file.",
      step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.copy,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];
}

export default function HomePage() {
  const universalTool = findTool("image-to-stl");
  const relatedTools = relatedToolSlugs.map(findTool).filter(Boolean);

  return (
    <main className="refPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />
      <header className="refTopbar" aria-label="Site header">
        <div className="refTopbarInner">
          <BrandMark />
          <nav className="refTopNav" aria-label="Primary">
            <Link href="#converter">Converter</Link>
            <Link href="#about">About</Link>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
          <div className="refTopActions">
            <Link href="#converter-panel">Preview your STL free</Link>
          </div>
        </div>
      </header>

      <section className="refHero" id="converter" aria-labelledby="hero-title">
        <Link href="#converter-panel" className="refAnnouncement">
          <span>2026</span>
          <strong>🎁 Preview your STL free before you download</strong>
        </Link>
        <div className="refHeroCopy">
          <h1 id="hero-title">Convert image to STL for 3D printing</h1>
          <p>
            Upload a PNG, JPG, or WebP and choose the safest printable route: logo extrusion, photo relief, lithophane, or heightmap STL.
          </p>
        </div>
        <div className="refTrustStrip" aria-label="Conversion trust details">
          {trustStats.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="refModeTabs" aria-label="Conversion modes">
        <Link className="active" href="#converter-panel">Image to STL</Link>
        <Link href="/text-to-3d">Text to 3D</Link>
        <Link href="/2d-image-to-3d-model">2D to 3D Relief</Link>
      </div>

      <section className="refConverterSection" id="converter-panel" aria-label="Image to STL converter">
        {universalTool && <ConverterPanel tool={universalTool} compactHome />}
      </section>

      <section className="refBenefits" aria-label="Key benefits">
        <div className="refThreeGrid">
          {quickBenefits.map((item) => (
            <article key={item.title} className="refBenefitCard">
              <IconMark />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="refAbout" id="about" aria-labelledby="about-title">
        <div className="refAboutVisual">
          <div className="refAboutFlowCard" aria-label="Image to STL workflow preview">
            <div className="refAboutFlowInput">
              <span>PNG</span>
              <div className="refInputPreview" aria-hidden="true">
                <i />
                <b />
                <em />
              </div>
              <strong>logo-artwork.png</strong>
              <small>Transparent icon · high contrast</small>
            </div>
            <div className="refAboutFlowArrow" aria-hidden="true">→</div>
            <div className="refAboutFlowOutput">
              <div className="refReliefPreview" aria-hidden="true">
                <span />
                <span />
                <span />
                <i />
              </div>
              <strong>STL relief preview</strong>
              <small>Raised edges · printable base · slicer ready</small>
            </div>
            <div className="refAboutFlowSteps">
              {aboutFlow.map((item) => (
                <div key={item.step}>
                  <span>{item.step}</span>
                  <strong>{item.title}</strong>
                  <small>{item.copy}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="refAboutCopy">
          <h2 id="about-title">What is Image to STL Conversion</h2>
          <p>
            Image to STL conversion turns flat graphics, drawings, and photos into printable 3D model files.
            PNGtoSTL helps you choose the right relief-style workflow and keeps the output practical for real 3D printing.
          </p>
          <ul>
            {aboutPoints.map((point) => (
              <li key={point}><IconMark />{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="refCentered" aria-labelledby="why-title">
        <h2 id="why-title" className="refSectionTitle">Why Choose Our Image to STL?</h2>
        <p className="refSectionSub">
          Our converter focuses on speed, usability, and print-ready results, helping creators move from flat artwork to useful STL files without complex 3D software.
        </p>
      </section>

      <section className="refHowTo" aria-labelledby="howto-title">
        <h2 id="howto-title" className="refSectionTitle">How to Use Image to STL Converter</h2>
        <div className="refStepGrid">
          {steps.map((step) => (
            <article key={step.step} className="refStepCard">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="refAdvanced" id="features" aria-labelledby="features-title">
        <h2 id="features-title" className="refSectionTitle">Advanced Image to STL Converter Features</h2>
        <div className="refSixGrid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="refFeatureCard">
              <IconMark />
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="refShowcase" id="showcase" aria-labelledby="showcase-title">
        <div className="refShowcaseHead">
          <div>
            <p className="refEyebrow">Premium STL examples</p>
            <h2 id="showcase-title" className="refSectionTitle">Turn Any Image Into a Printable 3D Model</h2>
            <p className="refShowcaseSub">Generate detailed STL files from PNG images in seconds.</p>
          </div>
        </div>
        <div className="refShowcaseGrid refPremiumShowcaseGrid">
          {showcase.map((card) => (
            <article key={card.title} className={card.variant === "temple" ? "refShowcaseCard refPremiumShowcaseCard refTempleShowcaseCard" : "refShowcaseCard refPremiumShowcaseCard"}>
              <div className={card.variant === "temple" ? "refPremiumModelFrame refTempleModelFrame" : "refPremiumModelFrame"}>
                {card.model ? (
                  <model-viewer
                    className="refTempleModelViewer"
                    src={card.model}
                    poster={card.image}
                    alt={card.alt}
                    auto-rotate
                    auto-rotate-delay="0"
                    rotation-per-second="8deg"
                    camera-orbit="180deg 68deg 115%"
                    min-camera-orbit="auto 58deg 100%"
                    max-camera-orbit="auto 76deg 145%"
                    field-of-view="28deg"
                    interaction-prompt="none"
                    disable-zoom
                    shadow-intensity="0.65"
                    environment-image="neutral"
                    exposure="0.92"
                  />
                ) : card.video ? (
                  <LazyVideo
                    className="refShowcaseVideo"
                    src={card.video}
                    poster={card.image}
                    label={card.alt}
                  />
                ) : (
                  <Image src={card.image} alt={card.alt} width={820} height={620} loading="lazy" />
                )}
              </div>
              <div className="refPremiumShowcaseCopy">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="refPricing" id="pricing" aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="refSectionTitle">Pricing</h2>
        <div className="refPricingGrid">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={plan.featured ? "refPricingCard featured" : "refPricingCard"}>
              <h3>{plan.name}</h3>
              <div className="refPriceRow">
                <span className="refOldPrice">{plan.oldPrice}</span>
                <strong className="refPrice">{plan.price}</strong>
                <span className="refPeriod">{plan.period}</span>
              </div>
              <p className="refPlanCopy">{plan.copy}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Link href="#converter-panel" className="refBtnPrimary">
                Preview your STL free
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="refFaq" id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="refSectionTitle">Frequently Asked Questions About Image to STL Conversion</h2>
        <div className="refFaqGrid">
          {faqs.map((faq) => (
            <details key={faq.q} className="refFaqItem">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="refRelated" aria-labelledby="related-title">
        <h2 id="related-title" className="refSectionTitle">Explore More Image to STL Tools</h2>
        <div className="refRelatedGrid">
          {relatedTools.map((tool) => (
            <Link key={tool!.slug} className="refRelatedCard" href={`/${tool!.slug}`}>
              <strong>{relatedToolLabels[tool!.slug] ?? tool!.navLabel}</strong>
              <span>{tool!.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="refCta" aria-labelledby="cta-title">
        <h2 id="cta-title">Start Your 3D Creation Journey</h2>
        <p>Upload your first image and create a printable STL workflow today.</p>
        <Link className="refBtnPrimary" href="#converter-panel">Preview your STL free</Link>
      </section>

      <footer className="refFooter" aria-label="Footer">
        <div className="refFooterInner">
          <div className="refFooterBrand">
            <strong>PNGtoSTL</strong>
            <p>Image to STL conversion for makers, designers, and 3D printing workflows.</p>
          </div>
          <div className="refFooterCol">
            <h4>Product</h4>
            <Link href="/image-to-stl">Image to STL</Link>
            <Link href="/png-to-stl">PNG to STL</Link>
            <Link href="/photo-to-stl">Photo to STL</Link>
          </div>
          <div className="refFooterCol">
            <h4>Resources</h4>
            <Link href="/samples">Examples</Link>
            <Link href="/lithophane-generator">Lithophane</Link>
            <Link href="/heightmap-to-stl">Heightmap</Link>
          </div>
          <div className="refFooterCol">
            <h4>Company</h4>
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="refFooterBottom">
          <p>© 2026 PNGtoSTL. All rights reserved.</p>
        </div>
      </footer>

      <Script id="pngtostl-model-viewer" type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="afterInteractive" />
      <Script id="pngtostl-stl-preview" src="/stl-preview.js?v=ref-20260612" strategy="afterInteractive" />
      <Script id="pngtostl-converter" src="/converter.js?v=ref-20260612" strategy="afterInteractive" />
    </main>
  );
}
