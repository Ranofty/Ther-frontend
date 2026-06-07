import { IncomingMessage, ServerResponse } from "http";
// @ts-ignore
import server from "../dist/server/server.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url}`;

  // Read request body stream for non-GET/HEAD methods
  let body: any = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }

  // Create standard Web Request
  const webRequest = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: body,
  });

  // Call SSR server fetch handler
  const webResponse = await server.fetch(webRequest, {}, {});

  // Copy status and headers to Node response
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Write response body
  const responseBody = await webResponse.arrayBuffer();
  res.end(Buffer.from(responseBody));
}
