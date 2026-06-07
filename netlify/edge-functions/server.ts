import server from "../../src/server";

export default async function (request: Request, context: any) {
  const url = new URL(request.url);
  
  // Serve static assets and files directly from Netlify CDN instead of running SSR
  if (url.pathname.startsWith("/assets/") || url.pathname.includes(".")) {
    return; // Returning undefined/no-response passes request to the static CDN files
  }

  return server.fetch(request, {}, {});
}
