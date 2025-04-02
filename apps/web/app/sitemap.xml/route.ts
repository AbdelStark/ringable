// Basic Sitemap Generation (Route Handler)
// See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

// Replace with your actual deployed domain
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://YOUR_DOMAIN.com";

export async function GET() {
  // Basic static pages
  const staticRoutes = ["/", "/settings", "/rings", "/proposals/new"];

  // TODO: Add dynamic routes for proposals if needed, e.g.:
  // const proposals = await fetchProposals(); // Fetch proposal IDs
  // const proposalRoutes = proposals.map(p => `/proposals/${p.id}`);

  const routes = [...staticRoutes /*, ...proposalRoutes */];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>${`${BASE_URL}${route}`}</loc>
      <lastmod>${
        new Date().toISOString().split("T")[0]
      }</lastmod> {/* Use current date as placeholder */}
    </url>`,
    )
    .join("")}
</urlset>`;

  return new Response(sitemapContent, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
