import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_DASHBOARD_PATHS = new Set([
  "/dashboard-araf/login",
  "/dashboard-araf/forgot-password",
]);

/**
 * Protects /dashboard-araf only. Portfolio (/) is untouched and never links here.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname === "/dashboard-araf" || pathname.startsWith("/dashboard-araf/");

  if (!isDashboard) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicDashboardPath = PUBLIC_DASHBOARD_PATHS.has(pathname);

  if (!user && !isPublicDashboardPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard-araf/login";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/dashboard-araf/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard-araf";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard-araf", "/dashboard-araf/:path*"],
};
