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
    mode: "icon" | "logo" | "sketch" | "relief" | "heightmap" | "lithophane";
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
    description: "A PNG-focused image-to-STL workflow for transparent icons, emojis, stamps, silhouettes, and simple graphics that need clean raised relief.",
    promise: "Use this page when alpha transparency, flat colors, and crisp icon edges matter more than photo detail.",
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
      { q: "Is this a real 3D model?", a: "It creates a relief-style STL based on PNG brightness and transparency, not a CAD reconstruction." },
      { q: "How is transparent PNG handled?", a: "Transparent or empty areas are treated as background so icons and silhouettes can become cleaner raised relief plates." },
      { q: "What PNG images work best?", a: "Flat icons, black-and-white art, emojis, stamps, silhouettes, and simple logos usually work better than noisy screenshots." },
      { q: "Why keep a PNG page if Image to STL accepts more formats?", a: "PNG users often need alpha transparency, crisp edges, and icon-style defaults. The universal converter remains the best broad-format entry." },
    ],
  },
  {
    slug: "image-to-stl",
    navLabel: "Image to STL",
    eyebrow: "Universal image converter",
    title: "Image to STL Converter",
    description: "Upload PNG, JPG, WebP, GIF, or BMP and choose the STL workflow that matches your print: relief, logo badge, lithophane, or heightmap surface.",
    promise: "Start here when you are unsure which image-to-STL workflow fits the source image and print goal.",
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
      { label: "Relief Settings", href: "/image-to-stl-relief-settings" },
      { label: "Contrast Guide", href: "/image-contrast-guide" },
      { label: "Convert Image to STL", href: "/convert-image-to-stl" },
    ],
    faq: [
      { q: "What images work best?", a: "Simple, high-contrast images with clear subjects usually produce cleaner relief or lithophane output." },
      { q: "Which mode should I choose?", a: "Use relief for icons and simple art, logo for badges, lithophane for backlit photos, and heightmap for grayscale depth maps." },
      { q: "Can every photo become a model?", a: "No. A single image can become a relief, lithophane, or heightmap-style STL, but not a full reconstructed 3D object." },
      { q: "Do colors appear in the STL?", a: "No. STL is single-material geometry. Brightness, contrast, and transparency influence shape, not color output." },
    ],
  },
  {
    slug: "convert-image-to-stl",
    navLabel: "Convert Image",
    eyebrow: "Step-by-step converter",
    title: "Convert Image to STL",
    description: "A guided image-to-STL workflow for beginners who need to check image quality, choose relief settings, preview limits, and download a printable STL.",
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
    description: "Create 3D printable lithophane STL files from photos, set safe thickness ranges, preview backlit detail, and download a panel ready for slicer checks.",
    promise: "Set thickness, invert the image, preview backlit detail, and download the result.",
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
      { label: "Best Lithophane Settings", href: "/best-lithophane-settings" },
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
    description: "Turn a portrait or photo into a lithophane-style STL for backlit 3D printing with contrast checks, panel sizing, and thickness guidance.",
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
    description: "Choose whether a photo should become a lithophane, relief STL, or another image-to-STL workflow before spending time on the wrong print path.",
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
    description: "A JPG/photo-focused image-to-STL entry for relief prints, photo cleanup decisions, and lithophane alternatives.",
    promise: "Use this page for common camera or downloaded JPG files, with clear guidance that ordinary photos usually work better as lithophanes than raised reliefs.",
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
      { q: "Should I use JPG to STL or lithophane?", a: "Use lithophane for portraits and photos with subtle shading. Use JPG relief when the subject has strong contrast and clear edges." },
      { q: "Why can photo relief look noisy?", a: "JPG photos contain shadows, texture, compression artifacts, and backgrounds. Those values can become unwanted bumps in a relief STL." },
      { q: "Is this photo reconstruction?", a: "No. It prepares a relief or lithophane-style STL path, not a full 3D reconstructed object." },
    ],
  },
  {
    slug: "logo-to-stl",
    navLabel: "Logo to STL",
    eyebrow: "Logo relief tool",
    title: "Logo to STL Converter",
    description: "Turn simple logos, icons, and transparent PNG artwork into raised relief STL files for 3D printed badges, signs, stamps, and maker labels.",
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
    description: "Convert grayscale heightmaps and brightness maps into relief-style STL terrain, surface tiles, and printable depth-mapped panels with smoothing controls.",
    promise: "Map light and dark values into printable height for terrain or surface relief.",
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
    description: "Turn 2D images into relief-style 3D printable STL files while setting realistic expectations about single-image depth and full 3D reconstruction limits.",
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

type HelperPage = {
  slug: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  checks: string[];
  intent?: string;
  advisorKind?: "photo-path" | "jpg-gate" | "contrast" | "print-settings" | "logo" | "heightmap";
  sampleSlugs?: string[];
  faqs?: Array<{ q: string; a: string }>;
  steps?: Array<{ title: string; body: string }>;
};

export const helperPages: HelperPage[] = [
  {
    slug: "image-contrast-guide",
    title: "Image Contrast Guide",
    description: "Check whether an image has enough contrast, clean edges, and simple background separation before converting it into a relief, logo, or lithophane STL.",
    cta: "Try Image to STL",
    href: "/image-to-stl",
    advisorKind: "contrast",
    intent: "Use this guide before uploading when a relief STL looks muddy, letters merge together, or a lithophane preview loses the subject after grayscale conversion.",
    sampleSlugs: ["universal-relief", "logo-badge-relief", "backlit-lithophane-panel"],
    checks: [
      "Use clear edges between the subject and background.",
      "Avoid noisy backgrounds, compression artifacts, and shadows that can become unwanted bumps.",
      "Increase contrast for better relief separation before generating the STL.",
      "Keep the subject simple when possible; icons, silhouettes, and line art convert more predictably than busy photos.",
      "Crop out unused background so the model focuses on the printable subject.",
      "Preview grayscale values before choosing relief, logo, lithophane, or heightmap mode.",
    ],
    steps: [
      { title: "Separate the subject", body: "Start with a clear foreground and background. If the subject is hard to see in a small thumbnail, the STL relief will usually look noisy or flat." },
      { title: "Check grayscale contrast", body: "Brightness becomes height or thickness in many image-to-STL workflows. Convert the image mentally to grayscale and make sure important details still stand apart." },
      { title: "Choose the right output", body: "Use logo relief for crisp flat artwork, lithophane for photos with midtone detail, and heightmap mode only when the image is meant to encode depth." },
    ],
    faqs: [
      { q: "Why does contrast matter for image to STL?", a: "Contrast controls how clearly the converter can separate raised and recessed areas. Low-contrast images often create muddy relief with weak edges." },
      { q: "Should I edit the image before converting?", a: "Yes when the subject is noisy, dark, or surrounded by a busy background. Cropping, cleanup, and contrast adjustment can save failed prints." },
      { q: "Is high contrast always better?", a: "Not always. Logos and reliefs benefit from strong contrast, while lithophanes need balanced midtones so faces and shadows remain readable when backlit." },
    ],
  },
  {
    slug: "print-settings-checker",
    title: "Print Settings Checker",
    description: "Review practical slicer starting points for relief STL, logo badges, lithophane panels, and heightmap surfaces before wasting filament on a full print.",
    cta: "Check Print Settings",
    href: "/lithophane-generator",
    advisorKind: "print-settings",
    intent: "Use this checker after generating or previewing an STL to decide whether the model needs safer thickness, orientation, layer height, or a smaller test print.",
    sampleSlugs: ["backlit-lithophane-panel", "logo-badge-relief", "terrain-heightmap-tile"],
    checks: [
      "Use smaller layer heights for lithophanes and detailed relief surfaces.",
      "Keep thin lithophane panels within a safe minimum thickness before slicing.",
      "Print logo badges with a base plate when letters or icon islands are disconnected.",
      "Check orientation before printing tall relief or backlit photo panels.",
      "Run a small crop or scaled test before committing to a large panel.",
      "Review material and nozzle limits when tiny text, steep terrain, or thin edges appear in the STL.",
    ],
    steps: [
      { title: "Inspect the STL first", body: "Open the downloaded STL in your slicer and check dimensions, thin walls, disconnected islands, and whether the relief is too shallow or too tall." },
      { title: "Start with conservative settings", body: "Use practical layer height and thickness defaults before chasing maximum detail. Most failed image-to-STL prints come from fragile geometry or poor orientation." },
      { title: "Print a small test", body: "For photos, lithophanes, and dense heightmaps, print a crop or reduced-size sample to verify contrast, surface detail, and backlighting before a full plate." },
    ],
    faqs: [
      { q: "What layer height should I use for lithophanes?", a: "A smaller layer height usually preserves more photo detail. Start conservatively, then adjust based on your nozzle, material, and panel size." },
      { q: "Do relief STL files need supports?", a: "Many flat relief plates do not need supports, but tall raised details, steep terrain, or vertical lithophane panels may require orientation changes or support planning." },
      { q: "Why print a small test first?", a: "A small test reveals contrast, thin-wall, and scale problems before you spend hours and filament on the final STL print." },
    ],
  },
  {
    slug: "how-to-turn-logo-into-stl",
    title: "How to Turn a Logo into an STL for 3D Printing",
    description: "A practical logo-to-STL workflow for badges, signs, stamps, and maker labels, with checks for clean edges, relief height, and printable text.",
    cta: "Load logo badge preset",
    href: "/logo-to-stl?sample=logo-badge-relief&utm_source=seo_helper&utm_medium=internal&utm_campaign=logo_to_stl_guide",
    intent: "Users want to convert a logo into a printable raised badge or sign, not reconstruct a full 3D mascot.",
    advisorKind: "logo",
    sampleSlugs: ["logo-badge-relief", "rubber-stamp-relief", "workshop-sign-plate"],
    checks: [
      "Use a transparent PNG or simple black-on-white logo.",
      "Avoid thin serif text, tiny taglines, gradients, and mascot illustrations.",
      "Start around 80-120 mm width for signs and 2.0-2.4 mm relief height.",
      "Keep a base plate when the logo has disconnected islands or loose letters.",
    ],
    steps: [
      { title: "Prepare the artwork", body: "Use the highest-resolution logo you have. Transparent PNG works best because the converter can treat empty areas as background instead of raised geometry." },
      { title: "Choose badge-style settings", body: "Start with low smoothing, a printable base, and conservative relief height. Very tall relief can look dramatic but may print slowly or create fragile edges." },
      { title: "Inspect before printing", body: "Open the downloaded STL in a slicer. Check small letters, holes inside characters, and whether separated pieces need a shared base plate." },
    ],
    faqs: [
      { q: "Can I turn any logo into an STL?", a: "Simple, high-contrast logos work best. Gradients, shadows, tiny text, and detailed mascots often need cleanup before conversion." },
      { q: "Should a logo STL have a base plate?", a: "Usually yes for badges, signs, and stamps. A base keeps separated letters or icon islands connected and easier to print." },
    ],
  },
  {
    slug: "lithophane-image-guide",
    title: "Best Image for Lithophane 3D Prints",
    description: "Choose photos that work well as lithophanes, set thickness safely, and avoid washed-out or underexposed images before generating an STL.",
    cta: "Load lithophane preset",
    href: "/lithophane-generator?sample=backlit-lithophane-panel&utm_source=seo_helper&utm_medium=internal&utm_campaign=lithophane_image_guide",
    intent: "Users need to know whether a photo will become a readable backlit lithophane before wasting a print.",
    advisorKind: "photo-path",
    sampleSlugs: ["backlit-lithophane-panel", "portrait-lithophane-night-light"],
    checks: [
      "Pick photos with one clear subject and visible midtone contrast.",
      "Avoid blown-out highlights, very dark faces, and cluttered backgrounds.",
      "Use thin-to-thick ranges such as 0.8-3.0 mm or 0.8-3.2 mm for first tests.",
      "Print vertically or with enough support depending on panel size and slicer settings.",
    ],
    steps: [
      { title: "Check the subject", body: "Faces, pets, and simple scenes usually work better than busy landscapes. If the subject disappears in grayscale, it will likely disappear in the lithophane." },
      { title: "Set thickness range", body: "Thin areas transmit more light and thick areas block it. Start conservative so the panel is printable and still shows contrast when backlit." },
      { title: "Test with light", body: "A lithophane can look flat without backlight. Inspect the STL, slice it, and test a small crop before committing to a large panel." },
    ],
    faqs: [
      { q: "What kind of photo is best for a lithophane?", a: "A clear subject, balanced contrast, and simple background usually produce the most readable backlit print." },
      { q: "Should lithophanes be inverted?", a: "Often yes, because thickness controls brightness. The generator presets use lithophane-oriented inversion as a starting point." },
    ],
  },
  {
    slug: "heightmap-to-stl-terrain-guide",
    title: "Heightmap to STL Terrain Guide",
    description: "Turn grayscale heightmaps into printable terrain-style STL surfaces with practical width, max height, smoothing, and input checks.",
    cta: "Load terrain preset",
    href: "/heightmap-to-stl?sample=terrain-heightmap-tile&utm_source=seo_helper&utm_medium=internal&utm_campaign=heightmap_terrain_guide",
    intent: "Users with grayscale terrain or texture maps need brightness-to-height rules and safe print starting points.",
    advisorKind: "heightmap",
    sampleSlugs: ["heightmap-surface", "terrain-heightmap-tile"],
    checks: [
      "Use an actual grayscale heightmap where white means higher elevation and black means lower elevation.",
      "Do not use a normal color photo unless it was designed as height data.",
      "Start around 110-120 mm width and 5.5-6 mm max height for terrain tiles.",
      "Use low smoothing for readable terrain, more smoothing only when steps look too jagged.",
    ],
    steps: [
      { title: "Confirm the map type", body: "A heightmap is data, not just a landscape photo. Brightness values become geometry, so labels, colors, and shadows can create unwanted terrain." },
      { title: "Set safe height", body: "A max height around 5.5-6 mm gives visible terrain without creating cliffs that are hard to print at small scale." },
      { title: "Inspect the surface", body: "Check whether the terrain needs a base slab, lower smoothing, or a crop before printing the full tile." },
    ],
    faqs: [
      { q: "Can I use any terrain image as a heightmap?", a: "No. Use a grayscale heightmap or depth map. Regular photos and colored maps usually do not encode height cleanly." },
      { q: "What does white mean in a heightmap?", a: "In this workflow, brighter pixels become higher areas and darker pixels become lower areas." },
    ],
  },
  {
    slug: "best-lithophane-settings",
    title: "Best Lithophane Settings for 3D Printing",
    description: "Choose safe lithophane thickness, image inversion, panel size, layer height, and test-print settings before downloading a photo-to-STL lithophane.",
    cta: "Open lithophane generator",
    href: "/lithophane-generator?sample=portrait-lithophane-night-light&utm_source=seo_helper&utm_medium=internal&utm_campaign=best_lithophane_settings",
    intent: "Users searching for lithophane settings usually have a photo ready and need practical numbers before they print.",
    advisorKind: "print-settings",
    sampleSlugs: ["backlit-lithophane-panel", "portrait-lithophane-night-light"],
    checks: [
      "Start with about 0.8 mm minimum thickness and 3.0-3.2 mm maximum thickness for a first test.",
      "Use image inversion when thicker areas should block more light and thin areas should glow brighter.",
      "Keep the subject simple and crop tightly so faces or pets stay readable when backlit.",
      "Print a small crop before committing to a full portrait, gift panel, or night-light insert.",
    ],
    steps: [
      { title: "Prepare the photo", body: "Pick a clear subject with visible midtones. Very dark faces, blown highlights, and cluttered backgrounds usually make weak lithophanes." },
      { title: "Set thickness first", body: "Thickness controls brightness. A conservative 0.8-3.2 mm range is easier to slice and test than extreme thin or thick settings." },
      { title: "Validate with a test print", body: "Download the STL, slice a small crop, and check it with a light source before printing the final panel." },
    ],
    faqs: [
      { q: "What thickness is best for lithophanes?", a: "A practical first range is about 0.8 mm minimum and 3.0-3.2 mm maximum, then adjust for your filament, light source, and printer." },
      { q: "Should I invert a lithophane image?", a: "Usually yes. In lithophanes, geometry thickness controls how much light passes through, so inversion often makes the final backlit image read correctly." },
      { q: "What layer height should I use?", a: "Use a smaller layer height for more detail, then verify with a small test because printer, nozzle, and panel size matter." },
    ],
  },
  {
    slug: "image-to-stl-relief-settings",
    title: "Image to STL Relief Settings for 3D Printing",
    description: "Pick practical relief depth, base thickness, image contrast, smoothing, and width settings when turning images, icons, and line art into STL files.",
    cta: "Open image to STL converter",
    href: "/image-to-stl?sample=universal-image-relief&utm_source=seo_helper&utm_medium=internal&utm_campaign=image_to_stl_relief_settings",
    intent: "Users with an image often need starting settings that make the STL printable instead of noisy, fragile, or too flat.",
    advisorKind: "contrast",
    sampleSlugs: ["universal-image-relief", "coin-relief-medallion", "pet-photo-relief"],
    checks: [
      "Use strong subject-background contrast before raising brightness into geometry.",
      "Start with moderate relief depth rather than a very tall surface that creates fragile details.",
      "Keep a base plate when letters, islands, or icon parts would otherwise become disconnected.",
      "Use smoothing carefully: too little can look jagged, while too much can erase text and edges.",
    ],
    steps: [
      { title: "Choose the right image", body: "Icons, line art, silhouettes, and simple high-contrast photos make cleaner relief STL files than busy scenes or low-contrast screenshots." },
      { title: "Start with safe geometry", body: "Set a printable width, moderate relief height, and base thickness before chasing maximum detail. The goal is a clean first STL, not the tallest possible surface." },
      { title: "Inspect before download", body: "Check whether small text merged, edges became noisy, or large flat areas need cropping before using the STL for a full print." },
    ],
    faqs: [
      { q: "What relief depth should I start with?", a: "Start moderate, then raise it only if the preview looks too flat. Very tall relief can be slow to print and may make thin details fragile." },
      { q: "Do I need a base plate?", a: "Use a base plate for logos, text, badges, signs, and any design with separated islands so the print stays connected." },
      { q: "Can a normal photo become a relief STL?", a: "Sometimes, but high-contrast subjects work best. Many photos are better as lithophanes instead of raised relief." },
    ],
  },
];

export const staticPages = [
  {
    slug: "samples",
    title: "Image to STL Examples",
    description: "Explore real image-to-STL examples with source images, generated STL previews, recommended settings, file sizes, and downloadable sample models.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How PNGtoSTL handles uploads, conversion requests, analytics events, and contact messages.",
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Rules and limitations for using PNGtoSTL image-to-STL tools and generated files.",
  },
  {
    slug: "developers",
    title: "PNGtoSTL Developers and Batch Conversion",
    description: "Request early access for batch image-to-STL conversion, API workflows, commercial usage, higher limits, and repeatable STL generation support.",
  },
  {
    slug: "pricing",
    title: "PNGtoSTL Pricing",
    description: "Review current free image-to-STL access plus planned Pro, batch conversion, and API options for makers, schools, shops, and commercial workflows.",
  },
  {
    slug: "contact",
    title: "Contact PNGtoSTL",
    description: "Contact PNGtoSTL for support, feedback, bug reports, API access, batch conversion, and business inquiries.",
  },
];

export const sampleWorkflows = [
  {
    title: "Logo badge relief",
    category: "logo",
    categoryLabel: "Logo badge",
    input: "High-contrast PNG or SVG logo",
    output: "Raised logo STL with base plate",
    route: "/logo-to-stl",
    workflowCta: "Try logo badge settings",
    recommendedPreset: "Transparent logo relief · 95 mm width · 2.4 mm raised face · low smoothing",
    sourcePreview: "Black logo on transparent PNG",
    resultPreview: "Raised 95 mm badge plate",
    metrics: "22,300 triangles · 1.1 MB STL",
    fileSizeLabel: "1.1 MB",
    sourceImage: "/samples/logo-badge-premium-v4-source.png",
    previewImage: "/samples/logo-badge-premium-v4-preview.png",
    stlPath: "/samples/logo-badge-premium-v4.stl",
    settings: ["Mode: Transparent logo relief", "Width: 95 mm", "Relief height: 2.4 mm", "Smoothing: low"],
    bestFor: "badges, signs, makerspace labels, product marks",
    avoid: "photos, gradients, tiny text, complex mascot art",
  },
  {
    title: "Universal image relief",
    category: "relief",
    categoryLabel: "Relief",
    input: "PNG, JPG, WebP, GIF, or BMP with clear subject edges",
    output: "Front-facing relief STL with preview and metrics",
    route: "/image-to-stl",
    workflowCta: "Try universal relief settings",
    recommendedPreset: "Photo-style relief · 110 mm width · 2.4 mm relief height · 128 detail",
    sourcePreview: "Simple icon, line art, or high-contrast photo",
    resultPreview: "Relief surface with base thickness and downloadable STL",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/universal-relief-premium-v4-source.png",
    previewImage: "/samples/universal-relief-premium-v4-preview.png",
    stlPath: "/samples/universal-relief-premium-v4.stl",
    settings: ["Mode: Photo-style relief", "Width: 110 mm", "Relief height: 2.4 mm", "Detail: 128"],
    bestFor: "icons, line art, simple illustrations, high-contrast photos",
    avoid: "low contrast photos and images where the background is the subject",
  },
  {
    title: "Backlit lithophane panel",
    category: "lithophane",
    categoryLabel: "Lithophane",
    input: "Portrait or photo with balanced contrast",
    output: "Lithophane STL where thickness controls light",
    route: "/lithophane-generator",
    workflowCta: "Try lithophane panel settings",
    recommendedPreset: "Lithophane · 0.8-3.2 mm thickness · invert on · balanced contrast photo",
    sourcePreview: "Portrait photo with visible highlights and shadows",
    resultPreview: "Thin backlit panel, not a color print",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/lithophane-panel-premium-v4-source.png",
    previewImage: "/samples/lithophane-panel-premium-v4-preview.png",
    stlPath: "/samples/lithophane-panel-premium-v4.stl",
    settings: ["Mode: Lithophane", "Min thickness: 0.8 mm", "Max thickness: 3.2 mm", "Invert: on"],
    bestFor: "portraits, memorial photos, night lights, window panels",
    avoid: "very dark photos, blown-out highlights, cluttered backgrounds",
  },
  {
    title: "Heightmap surface",
    category: "heightmap",
    categoryLabel: "Heightmap",
    input: "Grayscale PNG heightmap",
    output: "Surface STL where brightness becomes height",
    route: "/heightmap-to-stl",
    workflowCta: "Try heightmap surface settings",
    recommendedPreset: "Heightmap terrain · 120 mm width · 6 mm max height · low smoothing",
    sourcePreview: "Black-to-white depth map, not a normal color photo",
    resultPreview: "Terrain-like surface with height variation",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/heightmap-surface-premium-v4-source.png",
    previewImage: "/samples/heightmap-surface-premium-v4-preview.png",
    stlPath: "/samples/heightmap-surface-premium-v4.stl",
    settings: ["Mode: Heightmap terrain", "Width: 120 mm", "Max height: 6 mm", "Smoothing: low"],
    bestFor: "terrain reliefs, texture plates, grayscale depth maps",
    avoid: "normal photos that are not intended as height data",
  },
  {
    title: "Rubber stamp relief",
    category: "logo",
    categoryLabel: "Stamp",
    input: "Black stamp artwork PNG with bold text and a clear border",
    output: "Compact raised stamp STL with printable letter strokes",
    route: "/logo-to-stl",
    workflowCta: "Try stamp relief settings",
    recommendedPreset: "Transparent logo relief · 80 mm width · 2.0 mm relief height · 112 detail",
    sourcePreview: "APPROVED / MAKER stamp graphic on transparent PNG",
    resultPreview: "Raised circular stamp relief with real STL mesh preview",
    metrics: "17,316 triangles · 0.8 MB STL",
    fileSizeLabel: "0.8 MB",
    sourceImage: "/samples/rubber-stamp-expanded-v1-source.png",
    previewImage: "/samples/rubber-stamp-expanded-v1-preview.png",
    stlPath: "/samples/rubber-stamp-expanded-v1.stl",
    settings: ["Mode: Transparent logo relief", "Width: 80 mm", "Relief height: 2.0 mm", "Detail: 112"],
    bestFor: "rubber stamp masters, embossing plates, approval marks, simple text seals",
    avoid: "thin serif fonts, long paragraphs, tiny date text, gray antialiased scans",
  },
  {
    title: "Coin relief medallion",
    category: "relief",
    categoryLabel: "Coin relief",
    input: "Round medallion line art with a central star and year text",
    output: "Circular relief STL suitable for a coin-style display print",
    route: "/image-to-stl",
    workflowCta: "Try coin relief settings",
    recommendedPreset: "Photo-style relief · 70 mm width · 2.2 mm relief height · 128 detail",
    sourcePreview: "High-contrast coin artwork with concentric rings",
    resultPreview: "Raised coin face rendered from the generated STL",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/coin-relief-expanded-v1-source.png",
    previewImage: "/samples/coin-relief-expanded-v1-preview.png",
    stlPath: "/samples/coin-relief-expanded-v1.stl",
    settings: ["Mode: Photo-style relief", "Width: 70 mm", "Relief height: 2.2 mm", "Detail: 128"],
    bestFor: "coins, challenge medallions, circular emblems, simple awards",
    avoid: "photorealistic faces, microscopic rim text, noisy metallic textures",
  },
  {
    title: "Workshop sign plate",
    category: "logo",
    categoryLabel: "Sign plate",
    input: "Bold text sign PNG with screw holes and a simple border",
    output: "Raised text sign plate STL with base geometry",
    route: "/png-to-stl",
    workflowCta: "Try sign plate settings",
    recommendedPreset: "Transparent PNG relief · 120 mm width · 1.8 mm relief height · 112 detail",
    sourcePreview: "WORKSHOP TOOLS sign artwork with transparent background",
    resultPreview: "Printable sign plate with readable raised letters",
    metrics: "14,396 triangles · 0.7 MB STL",
    fileSizeLabel: "0.7 MB",
    sourceImage: "/samples/sign-plate-expanded-v1-source.png",
    previewImage: "/samples/sign-plate-expanded-v1-preview.png",
    stlPath: "/samples/sign-plate-expanded-v1.stl",
    settings: ["Mode: Transparent logo relief", "Width: 120 mm", "Relief height: 1.8 mm", "Detail: 112"],
    bestFor: "garage labels, workshop signs, tool drawer labels, bold name plates",
    avoid: "narrow fonts, tiny secondary copy, low-resolution screenshots",
  },
  {
    title: "Pet photo relief",
    category: "relief",
    categoryLabel: "Pet relief",
    input: "High-contrast synthetic pet portrait with clear eyes and face outline",
    output: "Photo-style relief STL showing where portraits work and where detail is limited",
    route: "/jpg-to-stl",
    workflowCta: "Try pet photo relief settings",
    recommendedPreset: "Photo-style relief · 95 mm width · 2.0 mm relief height · high-contrast portrait",
    sourcePreview: "Simple pet portrait prepared for relief conversion",
    resultPreview: "Raised pet face relief with STL viewer proof",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/pet-photo-relief-expanded-v1-source.png",
    previewImage: "/samples/pet-photo-relief-expanded-v1-preview.png",
    stlPath: "/samples/pet-photo-relief-expanded-v1.stl",
    settings: ["Mode: Photo-style relief", "Width: 95 mm", "Relief height: 2.0 mm", "Detail: 128"],
    bestFor: "simple pet portraits, memorial plaques, high-contrast animal silhouettes",
    avoid: "busy backgrounds, dark fur on dark rooms, full-scene photos with tiny faces",
  },
  {
    title: "Portrait lithophane night light",
    category: "lithophane",
    categoryLabel: "Portrait lithophane",
    input: "Portrait photo prepared for a backlit lithophane panel",
    output: "Thin lithophane STL where thickness controls brightness",
    route: "/photo-to-lithophane",
    workflowCta: "Try portrait lithophane settings",
    recommendedPreset: "Lithophane · 0.8-3.0 mm thickness · invert on · portrait orientation",
    sourcePreview: "Grayscale portrait with clear facial contrast",
    resultPreview: "Warm translucent panel rendered from the generated STL",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/portrait-lithophane-expanded-v1-source.png",
    previewImage: "/samples/portrait-lithophane-expanded-v1-preview.png",
    stlPath: "/samples/portrait-lithophane-expanded-v1.stl",
    settings: ["Mode: Lithophane", "Min thickness: 0.8 mm", "Max thickness: 3.0 mm", "Invert: on"],
    bestFor: "night lights, gifts, portraits, memorial panels, window displays",
    avoid: "underexposed faces, blown-out highlights, cluttered backgrounds, color-only detail",
  },
  {
    title: "Terrain heightmap tile",
    category: "heightmap",
    categoryLabel: "Terrain tile",
    input: "Game-style grayscale terrain heightmap with hills and contour cues",
    output: "Raised terrain tile STL with visible ridges and printable slab thickness",
    route: "/heightmap-to-stl",
    workflowCta: "Try terrain tile settings",
    recommendedPreset: "Heightmap terrain · 110 mm width · 5.5 mm max height · 128 detail",
    sourcePreview: "Grayscale terrain map where white means higher elevation",
    resultPreview: "Terrain tile STL preview with height variation",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/terrain-tile-expanded-v1-source.png",
    previewImage: "/samples/terrain-tile-expanded-v1-preview.png",
    stlPath: "/samples/terrain-tile-expanded-v1.stl",
    settings: ["Mode: Heightmap terrain", "Width: 110 mm", "Max height: 5.5 mm", "Detail: 128"],
    bestFor: "terrain tiles, tabletop maps, texture plates, grayscale elevation data",
    avoid: "normal landscape photos, satellite color images, maps without height encoding",
  },
  {
    title: "Cookie cutter outline",
    category: "logo",
    categoryLabel: "Cookie cutter",
    input: "Bold transparent PNG outline with thick walls and simple curves",
    output: "Raised cutter-style STL outline with printable wall thickness",
    route: "/logo-to-stl",
    workflowCta: "Try cookie cutter settings",
    recommendedPreset: "Logo relief · 90 mm width · 2.6 mm wall height · low smoothing",
    sourcePreview: "Rounded cookie cutter outline with simple facial details",
    resultPreview: "Printable outline STL generated from the real converter",
    metrics: "12,972 triangles · 0.6 MB STL",
    fileSizeLabel: "0.6 MB",
    sourceImage: "/samples/cookie-cutter-expanded-v2-source.png",
    previewImage: "/samples/cookie-cutter-expanded-v2-preview.png",
    stlPath: "/samples/cookie-cutter-expanded-v2.stl",
    settings: ["Mode: Transparent logo relief", "Width: 90 mm", "Relief height: 2.6 mm", "Detail: 112"],
    bestFor: "cookie cutter outlines, fondant stamps, clay cutters, simple traced shapes",
    avoid: "thin decorative lines, complex silhouettes, tiny holes, photo-based art",
  },
  {
    title: "Keychain name tag",
    category: "logo",
    categoryLabel: "Keychain tag",
    input: "Simple name tag PNG with bold text, border, and keyring hole",
    output: "Raised keychain STL with connected letters and base plate",
    route: "/logo-to-stl",
    workflowCta: "Try keychain tag settings",
    recommendedPreset: "Logo relief · 85 mm width · 2.2 mm raised text · base plate on",
    sourcePreview: "MILO maker tag PNG with large text and keyring hole",
    resultPreview: "Printable tag STL with readable raised text",
    metrics: "11,180 triangles · 0.5 MB STL",
    fileSizeLabel: "0.5 MB",
    sourceImage: "/samples/keychain-tag-expanded-v2-source.png",
    previewImage: "/samples/keychain-tag-expanded-v2-preview.png",
    stlPath: "/samples/keychain-tag-expanded-v2.stl",
    settings: ["Mode: Transparent logo relief", "Width: 85 mm", "Relief height: 2.2 mm", "Detail: 112"],
    bestFor: "keychains, pet tags, maker badges, locker labels, simple name plates",
    avoid: "long names in tiny fonts, disconnected letters without a base, low-resolution screenshots",
  },
  {
    title: "Topographic coaster heightmap",
    category: "heightmap",
    categoryLabel: "Topo coaster",
    input: "Circular grayscale heightmap designed for a coaster-style relief tile",
    output: "Compact terrain coaster STL with visible contour-like height changes",
    route: "/heightmap-to-stl",
    workflowCta: "Try topo coaster settings",
    recommendedPreset: "Heightmap terrain · 100 mm width · 4.8 mm max height · 128 detail",
    sourcePreview: "Circular topo-style grayscale heightmap with contour rings",
    resultPreview: "Coaster-sized relief STL preview from the generated mesh",
    metrics: "65,532 triangles · 3.1 MB STL",
    fileSizeLabel: "3.1 MB",
    sourceImage: "/samples/topographic-coaster-expanded-v2-source.png",
    previewImage: "/samples/topographic-coaster-expanded-v2-preview.png",
    stlPath: "/samples/topographic-coaster-expanded-v2.stl",
    settings: ["Mode: Heightmap terrain", "Width: 100 mm", "Max height: 4.8 mm", "Detail: 128"],
    bestFor: "topographic coasters, terrain gifts, tabletop tokens, circular map reliefs",
    avoid: "normal color maps, text labels, satellite imagery, heightmaps with hard clipped edges",
  },
];

export type SampleWorkflow = (typeof sampleWorkflows)[number];

export function sampleWorkflowSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getSampleWorkflow(slug: string | undefined, route?: string) {
  if (!slug) return null;
  const sample = sampleWorkflows.find((workflow) => sampleWorkflowSlug(workflow.title) === slug);
  if (!sample) return null;
  if (route && sample.route !== route) return null;
  return sample;
}

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

