import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);
const LOCALE_HEADER = "X-NEXT-INTL-LOCALE";

function isLocalePrefixed(pathname: string, locale: string) {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // as-needed: /en → / so English stays unprefixed in the address bar.
  if (isLocalePrefixed(pathname, routing.defaultLocale)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === `/${routing.defaultLocale}`
        ? "/"
        : pathname.slice(`/${routing.defaultLocale}`.length);
    return NextResponse.redirect(url);
  }

  const prefixedLocale = routing.locales.find(
    (locale) =>
      locale !== routing.defaultLocale && isLocalePrefixed(pathname, locale),
  );
  if (prefixedLocale) {
    return handleI18n(request);
  }

  // Unprefixed default locale: do not NextResponse.rewrite() — Next 16.2+
  // turns that into a self-redirect. next.config rewrites "/" → "/en".
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, routing.defaultLocale);
  const response = NextResponse.next({ request: { headers } });
  response.cookies.set("NEXT_LOCALE", routing.defaultLocale, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals (_next, _vercel)
  // - static files (anything with a dot, e.g. favicon.ico)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
