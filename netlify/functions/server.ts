// @ts-ignore
import server from "../../dist/server/server.js";

export const handler = async (event: any, context: any) => {
  const protocol = event.headers["x-forwarded-proto"] || "http";
  const host = event.headers.host || "localhost";
  // Reconstruct path and query params
  const queryString = event.rawQuery ? `?${event.rawQuery}` : "";
  const url = `${protocol}://${host}${event.path}${queryString}`;

  // Read request body
  let body: any = null;
  if (event.body) {
    body = event.isBase64Encoded 
      ? Buffer.from(event.body, "base64") 
      : event.body;
  }

  // Construct Web API Request object
  const webRequest = new Request(url, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: body,
  });

  // Call the compiled TanStack Start SSR handler
  const webResponse = await server.fetch(webRequest, {}, {});

  // Convert Web Response back to Netlify Function response structure
  const responseHeaders: Record<string, string> = {};
  webResponse.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const responseBody = await webResponse.text();

  return {
    statusCode: webResponse.status,
    headers: responseHeaders,
    body: responseBody,
  };
};
