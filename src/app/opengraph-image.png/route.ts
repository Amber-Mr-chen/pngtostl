export const runtime = "edge";

export async function GET() {
  return Response.redirect(new URL("/og-icon.png", "https://pngtostl.net"), 308);
}
