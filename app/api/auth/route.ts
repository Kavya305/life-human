import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Step one of the CMS login.
 *
 * Decap's GitHub backend expects an OAuth handler at the site's own origin.
 * Netlify provides one; on Vercel we provide it ourselves — this route and
 * /api/callback are the whole of it.
 *
 * A random `state` is issued here and checked on the way back, so a callback
 * that did not originate from this route is rejected.
 */
export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse('GITHUB_CLIENT_ID is not set.', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${origin}/api/callback`);
  authorize.searchParams.set('scope', 'repo');
  authorize.searchParams.set('state', state);

  const response = NextResponse.redirect(authorize.toString());
  response.cookies.set('lh_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return response;
}
