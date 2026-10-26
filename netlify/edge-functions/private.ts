// Server-side gate for the private projects. Nothing under /projects/private/ or
// /Images SB/ is sent to a visitor until they have entered the password, which
// lives in the PRIVATE_PASSWORD environment variable on Netlify, not in the repo.
import type { Context } from "https://edge.netlify.com";

const COOKIE = "private_auth";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loginPage(failed: boolean): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Private — Cindy Lopez</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:#222;font:16px system-ui,sans-serif}
form{display:flex;gap:.5rem;flex-direction:column;align-items:center;text-align:center;padding:1.5rem}
input,button{font:inherit;padding:.6rem .9rem;border:1px solid #ccc;border-radius:6px}
button{background:#222;color:#fff;border-color:#222;cursor:pointer}p{margin:0;color:#b00020}</style></head>
<body><form method="post" action="/unlock"><h1 style="font-weight:400;font-size:1.3rem;margin:0 0 .5rem">This project is password protected</h1>
<input type="password" name="password" placeholder="Password" autocomplete="off" required autofocus>
<button type="submit">Unlock</button>${failed ? "<p>Incorrect password — try again.</p>" : ""}</form></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const password = Deno.env.get("PRIVATE_PASSWORD");
  // If the password is not configured, fail closed: nothing private is served.
  if (!password) return new Response("Not found", { status: 404 });
  const token = await sha256(`private|${password}`);

  if (url.pathname === "/unlock") {
    if (req.method !== "POST") return Response.redirect(new URL("/", url), 303);
    const form = await req.formData();
    if (form.get("password") === password) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/projects/private/",
          "set-cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`,
          "cache-control": "no-store",
        },
      });
    }
    // Wrong password: back to the home page tile with an error flag.
    return new Response(null, { status: 303, headers: { location: "/?locked=1", "cache-control": "no-store" } });
  }

  const cookie = req.headers.get("cookie") || "";
  const authed = cookie.split(";").some((c) => c.trim() === `${COOKIE}=${token}`);
  if (authed) {
    const res = await context.next();
    res.headers.set("cache-control", "private, no-store");
    res.headers.set("x-robots-tag", "noindex");
    return res;
  }

  // Pages get a password prompt; images and other files simply are not there.
  if (url.pathname.startsWith("/projects/private")) return loginPage(false);
  return new Response("Not found", { status: 404 });
};

export const config = {
  path: ["/unlock", "/projects/private", "/projects/private/*", "/Images%20SB/*", "/Images SB/*"],
};
