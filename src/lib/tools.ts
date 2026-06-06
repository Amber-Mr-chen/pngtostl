export type ToolConfig = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  promise: string;
  primaryCta: string;
  secondaryCta: string;
  uploadLabel: string;
  supported: string;
  controls: Array<{
    label: string;
    value: string;
    helper: string;
  }>;
  steps: string[];
  pains: string[];
  outputFacts: Array<{ label: string; value: string }>;
  limit: string;
  related: Array<{ label: string; href: string }>;
  faq: Array<{ q: string; a: string }>;
  converter?: {
    mode: "icon" | "logo" | "relief" | "heightmap" | "lithophane";
    accept?: string;
    widthMm?: number;
    depth?: number;
    baseMm?: number;
    threshold?: number;
    smoothing?: number;
    detail?: number;
    invert?: boolean;
    minThicknessMm?: number;
    maxThicknessMm?: number;
    hiddenControls?: Array<"mode" | "threshold" | "base" | "invert" | "depth">;
    helper: string;
    preview: string;
    filename: string;
  };
};

export const tools: ToolConfig[] = [
  {
    slug: "png-to-stl",
    navLabel: "PNG entry",
    eyebrow: "Format-specific starting point",
    title: "PNG to STL Converter",
    description: "A PNG-focused entry into the same image-to-STL converter, tuned for transparent icons, emojis, and simple graphics.",
    promise: "Upload a PNG or open the universal image converter when you want broader format support.",
    primaryCta: "Upload PNG",
    secondaryCta: "Use Universal Converter",
    uploadLabel: "Drag and drop your PNG here",
    supported: "PNG; use Image to STL for JPG/WebP/GIF/BMP",
    controls: [
      { label: "Depth", value: "58%", helper: "Higher depth creates taller relief." },
      { label: "Size", value: "96 mm", helper: "Set the printable width." },
      { label: "Invert heightmap", value: "Off", helper: "Switch raised and recessed areas." },
    ],
    steps: ["Upload your PNG.", "Adjust depth, size, and inversion.", "Download your STL."],
    pains: ["No CAD learning curve.", "No confusing multi-tool interface.", "No guessing what the output is."],
    outputFacts: [
      { label: "Format", value: "PNG -> STL" },
      { label: "Type", value: "Icon relief plate" },
      { label: "Color", value: "Geometry only" },
    ],
    limit: "This tool creates front-facing relief STL geometry. STL files do not preserve PNG colors or textures.",
    related: [
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "Lithophane Generator", href: "/lithophane-generator" },
      { label: "Image Contrast Guide", href: "/image-contrast-guide" },
    ],
    faq: [
      { q: "Is this a real 3D model?", a: "It creates a relief-style STL based on image brightness, not a CAD reconstruction." },
      { q: "Why keep a PNG page if Image to STL accepts more formats?", a: "PNG searches are common, and transparent PNG icons often need different relief defaults. The core generation flow is the same." },
    ],
  },
  {
    slug: "image-to-stl",
    navLabel: "Image to STL",
    eyebrow: "Universal image converter",
    title: "Image to STL Converter",
    description: "Upload PNG, JPG, WebP, GIF, or BMP and choose the STL workflow that matches your print: relief, logo, lithophane, or heightmap.",
    promise: "One upload entry for common image formats, with output modes and route-specific presets for printable STL files.",
    primaryCta: "Upload Image",
    secondaryCta: "Choose STL Mode",
    uploadLabel: "Drop an image to choose an STL workflow",
    supported: "PNG, JPG, WebP, GIF, BMP",
    controls: [
      { label: "Contrast", value: "64%", helper: "Boost edge separation before conversion." },
      { label: "Depth", value: "42%", helper: "Control relief height." },
      { label: "Output size", value: "120 mm", helper: "Keep prints within your bed size." },
    ],
    steps: ["Upload an image.", "Adjust contrast and depth.", "Download the STL."],
    pains: ["Clear guidance on which images work best.", "Less trial and error before printing.", "A single page for image-to-STL intent."],
    outputFacts: [
      { label: "Format", value: "Image -> STL" },
      { label: "Best for", value: "Logos, icons, high contrast art" },
      { label: "Output", value: "Relief STL" },
    ],
    limit: "The universal converter creates printable STL workflows from one image; it does not reconstruct a full 3D object from a single photo.",
    related: [
      { label: "PNG to STL", href: "/png-to-stl" },
      { label: "Contrast Guide", href: "/image-contrast-guide" },
      { label: "Convert Image to STL", href: "/convert-image-to-stl" },
    ],
    faq: [
      { q: "What images work best?", a: "Simple, high-contrast images with clear edges usually produce cleaner relief." },
      { q: "Can every photo become a model?", a: "No. This page creates relief-style STL output, not full object reconstruction." },
    ],
  },
  {
    slug: "convert-image-to-stl",
    navLabel: "Convert Image",
    eyebrow: "Step-by-step converter",
    title: "Convert Image to STL",
    description: "A guided image-to-STL workflow for 3D printing beginners.",
    promise: "Check the image, tune relief depth, and prepare a printable STL.",
    primaryCta: "Start Conversion",
    secondaryCta: "Check Image First",
    uploadLabel: "Upload image to start the checklist",
    supported: "PNG, JPG, WebP, GIF, BMP",
    controls: [
      { label: "Image clarity", value: "Good", helper: "Clear edges help the relief." },
      { label: "Relief depth", value: "Medium", helper: "Balanced height for beginner prints." },
      { label: "Base plate", value: "On", helper: "Adds a printable foundation." },
    ],
    steps: ["Upload an image.", "Run the suitability checklist.", "Generate a beginner-friendly STL."],
    pains: ["Explains what to fix before converting.", "Avoids blind uploads to generic converters.", "Keeps beginners focused on printable output."],
    outputFacts: [
      { label: "Workflow", value: "Guided" },
      { label: "Output", value: "STL relief" },
      { label: "Focus", value: "3D printing" },
    ],
    limit: "This guided page does not create a full 3D object from a single photo.",
    related: [
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "PNG to STL", href: "/png-to-stl" },
      { label: "Print Settings", href: "/print-settings-checker" },
    ],
    faq: [
      { q: "Why use this instead of the direct converter?", a: "It adds a checklist for image suitability before you generate the STL." },
      { q: "Does it change the output type?", a: "No. It still creates relief-style STL output." },
    ],
  },
  {
    slug: "lithophane-generator",
    navLabel: "Lithophane",
    eyebrow: "Photo light panel tool",
    title: "Lithophane Generator",
    description: "Create 3D printable lithophane STL files from your images.",
    promise: "Set thickness, invert the image, and download the result.",
    primaryCta: "Make Lithophane",
    secondaryCta: "Download STL",
    uploadLabel: "Upload your lithophane photo",
    supported: "PNG, JPG, WebP, GIF, BMP; high contrast recommended",
    controls: [
      { label: "Min thickness", value: "0.8 mm", helper: "Thin areas transmit more light." },
      { label: "Max thickness", value: "3.2 mm", helper: "Thick areas block more light." },
      { label: "Invert image", value: "On", helper: "Usually needed for lithophanes." },
    ],
    steps: ["Upload your photo.", "Set thickness and inversion.", "Download the lithophane STL."],
    pains: ["Clear settings for photo prints.", "Easier than CAD for lithophanes.", "Explains print setup before download."],
    outputFacts: [
      { label: "Type", value: "Lithophane STL" },
      { label: "Use", value: "Backlit photo print" },
      { label: "Mode", value: "Relief thickness" },
    ],
    limit: "Lithophane results depend on image contrast, thickness, and print settings.",
    related: [
      { label: "Photo to Lithophane", href: "/photo-to-lithophane" },
      { label: "3D Print Photo", href: "/3d-print-photo" },
      { label: "Print Settings", href: "/print-settings-checker" },
    ],
    faq: [
      { q: "Should lithophanes be inverted?", a: "Often yes, because thickness controls how much light passes through." },
      { q: "What makes a good lithophane photo?", a: "Photos with clear subjects and balanced contrast usually work best." },
    ],
  },
  {
    slug: "photo-to-lithophane",
    navLabel: "Photo Lithophane",
    eyebrow: "Photo-specific lithophane path",
    title: "Photo to Lithophane",
    description: "Turn a photo into a lithophane-style STL for backlit 3D printing.",
    promise: "Preview photo contrast, set thickness, and prepare a lithophane STL.",
    primaryCta: "Upload Photo",
    secondaryCta: "Check Photo",
    uploadLabel: "Drop a portrait or photo here",
    supported: "PNG, JPG, WebP, GIF, BMP",
    controls: [
      { label: "Photo contrast", value: "Balanced", helper: "Avoid washed-out images." },
      { label: "Panel width", value: "100 mm", helper: "Match your printer bed." },
      { label: "Orientation", value: "Vertical", helper: "Recommended for many lithophanes." },
    ],
    steps: ["Upload a photo.", "Check contrast and size.", "Create the lithophane STL."],
    pains: ["Safer than promising photo-to-3D reconstruction.", "Focuses on a real 3D printing use case.", "Helps users avoid poor photo choices."],
    outputFacts: [
      { label: "Input", value: "Photo" },
      { label: "Output", value: "Lithophane STL" },
      { label: "Best for", value: "Backlit prints" },
    ],
    limit: "This creates a lithophane panel, not a full 3D object model.",
    related: [
      { label: "Lithophane Generator", href: "/lithophane-generator" },
      { label: "3D Print Photo", href: "/3d-print-photo" },
      { label: "Image Contrast Guide", href: "/image-contrast-guide" },
    ],
    faq: [
      { q: "Is this photo to 3D?", a: "It is photo to lithophane, a realistic 3D printing task for a single image." },
      { q: "Can I use portraits?", a: "Yes, portraits can work well when contrast and lighting are clear." },
    ],
  },
  {
    slug: "3d-print-photo",
    navLabel: "3D Print Photo",
    eyebrow: "Photo print planning tool",
    title: "3D Print Photo",
    description: "Choose whether your photo is better for a lithophane or relief STL.",
    promise: "Answer a few print questions and get the right tool path.",
    primaryCta: "Check Photo Path",
    secondaryCta: "Open Lithophane Tool",
    uploadLabel: "Optional: upload photo for planning",
    supported: "No upload required for basic guidance",
    controls: [
      { label: "Goal", value: "Backlit photo", helper: "Use lithophane for light-based prints." },
      { label: "Printer", value: "FDM", helper: "FDM works well for larger lithophanes." },
      { label: "Detail level", value: "Medium", helper: "Higher detail may need smaller layers." },
    ],
    steps: ["Pick your photo goal.", "Review print setup suggestions.", "Open the matching generator."],
    pains: ["Prevents users from choosing the wrong workflow.", "Connects photo intent to real print settings.", "Adds value beyond a static article."],
    outputFacts: [
      { label: "Decision", value: "Lithophane or relief" },
      { label: "Output", value: "Tool recommendation" },
      { label: "Next step", value: "Generate STL" },
    ],
    limit: "These are general print suggestions, not guaranteed printer settings.",
    related: [
      { label: "Lithophane Generator", href: "/lithophane-generator" },
      { label: "Photo to Lithophane", href: "/photo-to-lithophane" },
      { label: "Print Settings Checker", href: "/print-settings-checker" },
    ],
    faq: [
      { q: "Can I 3D print a photo?", a: "Yes, usually as a lithophane or relief rather than a full object model." },
      { q: "Which path should I choose?", a: "Use lithophane for backlit photos and relief STL for raised surface art." },
    ],
  },
  {
    slug: "jpg-to-stl",
    navLabel: "JPG entry",
    eyebrow: "Format-specific starting point",
    title: "JPG to STL Converter",
    description: "A JPG/photo-focused entry into the universal image-to-STL converter, with relief defaults for common photo files.",
    promise: "Upload a JPG or other browser-readable image, then generate a printable STL relief with preview and metrics.",
    primaryCta: "Upload JPG",
    secondaryCta: "Generate STL",
    uploadLabel: "Drop a JPG, PNG, WebP, GIF, or BMP image here",
    supported: "JPG, PNG, WebP, GIF, BMP",
    controls: [
      { label: "Contrast boost", value: "52%", helper: "Helps photos produce clearer relief." },
      { label: "Noise cleanup", value: "Medium", helper: "Reduce messy relief artifacts." },
      { label: "Relief depth", value: "36%", helper: "Keep photo relief printable." },
    ],
    steps: ["Upload a JPG-style image.", "Clean contrast and noise.", "Generate a relief STL."],
    pains: ["Converts common browser-readable image formats in one place.", "Gives photo users a clearer path.", "Keeps output framed as relief STL."],
    outputFacts: [
      { label: "Input", value: "JPG/PNG/WebP/GIF/BMP" },
      { label: "Output", value: "Relief STL + preview" },
      { label: "Status", value: "Live browser normalization" },
    ],
    limit: "Non-PNG images are normalized to PNG in the browser before STL generation. STL output remains single-material geometry.",
    related: [
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "Photo to Lithophane", href: "/photo-to-lithophane" },
      { label: "Contrast Guide", href: "/image-contrast-guide" },
    ],
    faq: [
      { q: "How does JPG and WebP input work?", a: "The browser normalizes supported non-PNG images to PNG first, then sends the image to the STL relief generator." },
      { q: "Is this photo reconstruction?", a: "No. It prepares a relief-style STL path." },
    ],
  },
  {
    slug: "logo-to-stl",
    navLabel: "Logo to STL",
    eyebrow: "Logo relief tool",
    title: "Logo to STL Converter",
    description: "Turn simple logos and icons into raised relief STL files.",
    promise: "Use edge-friendly settings for badges, signs, and maker projects.",
    primaryCta: "Upload Logo",
    secondaryCta: "Preview Relief",
    uploadLabel: "Drop a high-contrast logo here",
    supported: "PNG or SVG",
    controls: [
      { label: "Edge sharpness", value: "High", helper: "Logos usually need crisp edges." },
      { label: "Base thickness", value: "1.2 mm", helper: "Adds a printable backing." },
      { label: "Relief height", value: "2.4 mm", helper: "Controls raised logo height." },
    ],
    steps: ["Upload a logo.", "Set base and relief height.", "Download a logo STL."],
    pains: ["Better for logos than a generic converter.", "Guides users toward simple high-contrast artwork.", "Useful for badges, plaques, and signs."],
    outputFacts: [
      { label: "Best for", value: "Logos/icons" },
      { label: "Output", value: "Raised STL" },
      { label: "Print type", value: "Badge/sign" },
    ],
    limit: "Complex or low-contrast logos may need cleanup before conversion.",
    related: [
      { label: "PNG to STL", href: "/png-to-stl" },
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "Heightmap to STL", href: "/heightmap-to-stl" },
    ],
    faq: [
      { q: "What logo works best?", a: "Flat, high-contrast logos with clean edges produce the best relief." },
      { q: "Can it make a 3D mascot?", a: "No. It makes raised logo relief, not a sculpted 3D character." },
    ],
  },
  {
    slug: "heightmap-to-stl",
    navLabel: "Heightmap to STL",
    eyebrow: "Heightmap relief builder",
    title: "Heightmap to STL Converter",
    description: "Convert brightness maps into relief-style STL terrain or surface files.",
    promise: "Map light and dark values into printable height.",
    primaryCta: "Upload Heightmap",
    secondaryCta: "Tune Heights",
    uploadLabel: "Drop a grayscale heightmap here",
    supported: "PNG grayscale recommended",
    controls: [
      { label: "Min height", value: "0.4 mm", helper: "Keeps the surface printable." },
      { label: "Max height", value: "8 mm", helper: "Controls the tallest points." },
      { label: "Smoothing", value: "Low", helper: "Reduce jagged steps when needed." },
    ],
    steps: ["Upload a heightmap.", "Set min and max height.", "Export an STL surface."],
    pains: ["Serves technical users who already know heightmaps.", "Clarifies brightness-to-height behavior.", "Useful for terrain and surface relief."],
    outputFacts: [
      { label: "Input", value: "Heightmap PNG" },
      { label: "Output", value: "Surface STL" },
      { label: "Mapping", value: "Brightness -> height" },
    ],
    limit: "Heightmap STL is a relief surface, not a full enclosed CAD assembly unless implementation adds walls/base.",
    related: [
      { label: "PNG to STL", href: "/png-to-stl" },
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "Print Settings", href: "/print-settings-checker" },
    ],
    faq: [
      { q: "What is a heightmap?", a: "A grayscale image where brightness represents surface height." },
      { q: "Can it make terrain?", a: "It can create relief-style terrain surfaces when the heightmap is suitable." },
    ],
  },
  {
    slug: "2d-image-to-3d-model",
    navLabel: "2D to 3D Relief",
    eyebrow: "Safe 2D-to-3D page",
    title: "2D Image to 3D Model",
    description: "Turn 2D images into relief-style 3D printable STL files.",
    promise: "A practical 2D-to-3D workflow without claiming full object reconstruction.",
    primaryCta: "Upload 2D Image",
    secondaryCta: "See Limits",
    uploadLabel: "Drop a 2D image for relief conversion",
    supported: "PNG minimum",
    controls: [
      { label: "Relief mode", value: "Raised", helper: "Creates a printable raised surface." },
      { label: "Depth", value: "Medium", helper: "Avoid overly tall models." },
      { label: "Base", value: "On", helper: "Adds support for printing." },
    ],
    steps: ["Upload a 2D image.", "Choose relief settings.", "Download a 3D printable STL."],
    pains: ["Captures broad 2D-to-3D intent safely.", "Explains the limit before users expect magic.", "Routes users to realistic relief/lithophane tools."],
    outputFacts: [
      { label: "Claim", value: "Relief only" },
      { label: "Output", value: "STL" },
      { label: "Not", value: "CAD reconstruction" },
    ],
    limit: "This page creates relief-style models from 2D images, not full 3D reconstructed objects.",
    related: [
      { label: "Image to STL", href: "/image-to-stl" },
      { label: "Photo to Lithophane", href: "/photo-to-lithophane" },
      { label: "FAQ", href: "/faq" },
    ],
    faq: [
      { q: "Why call it 2D image to 3D model?", a: "Because users search that way, but the page clearly explains the realistic relief-style output." },
      { q: "Will it reconstruct the back side?", a: "No. A single 2D image does not contain full object geometry." },
    ],
  },
];

export const helperPages = [
  {
    slug: "image-contrast-guide",
    title: "Image Contrast Guide",
    description: "Make your image easier to convert into a clean STL.",
    cta: "Try Image to STL",
    href: "/image-to-stl",
    checks: ["Use clear edges.", "Avoid noisy backgrounds.", "Increase contrast for better relief separation.", "Keep the subject simple when possible."],
  },
  {
    slug: "print-settings-checker",
    title: "Print Settings Checker",
    description: "Get basic printing suggestions for relief and lithophane files.",
    cta: "Check Print Settings",
    href: "/lithophane-generator",
    checks: ["Layer height suggestion.", "Orientation suggestion.", "Thickness guidance.", "Material note."],
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

