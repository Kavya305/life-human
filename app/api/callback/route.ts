import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Step two of the CMS login.
 *
 * Exchanges the GitHub code for a token, then hands it to the Decap window
 * that opened this popup using the handshake Decap listens for. The token is
 * never stored server-side and never written to a cookie — it goes straight
 * to the editor's own tab and lives only there.
 */

/** The token is injected into a script, so it must not be able to escape it. */
const jsonForScript = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

function respond(payload: string, ok: boolean) {
  const message = ok
    ? `authorization:github:success:${payload}`
    : `authorization:github:error:${payload}`;

  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title>
<body style="font:14px system-ui;padding:2rem;color:#1f1b16;background:#faf6ef">
Completing sign-in…
<script>
(function () {
  var message = ${jsonForScript(message)};
  function send(origin) { window.opener.postMessage(message, origin); }
  if (!window.opener) { document.body.textContent = 'Open the editor at /admin and try again.'; return; }
  window.addEventListener('message', function (e) { send(e.origin); }, { once: true });
  window.opener.postMessage('authorizing:github', '*');
})();
</script>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const store = await cookies();
  const expected = store.get('lh_oauth_state')?.value;

  if (!code || !state || !expected || state !== expected) {
    return respond(jsonForScript('Sign-in could not be verified. Try again.'), false);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return respond(jsonForScript('The site is missing its GitHub credentials.'), false);
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });

  const data = (await res.json()) as { access_token?: string; error_description?: string };

  if (!data.access_token) {
    return respond(jsonForScript(data.error_description ?? 'GitHub declined the sign-in.'), false);
  }

  const out = respond(
    jsonForScript({ token: data.access_token, provider: 'github' }),
    true,
  );
  out.cookies.delete('lh_oauth_state');
  return out;
}
