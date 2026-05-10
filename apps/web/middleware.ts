import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ONBOARDING_PUBLIC_PATHS = new Set(["/onboarding/welcome"]);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars aren't set yet (local dev), don't block — just pass through.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const isPanel = pathname.startsWith("/panel");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isOnboardingPublic = ONBOARDING_PUBLIC_PATHS.has(pathname);

  let {
    data: { user },
  } = await supabase.auth.getUser();

  // (1) No session AND visiting protected onboarding step or panel → bootstrap anonymous user.
  if (!user && (isPanel || (isOnboarding && !isOnboardingPublic))) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInAnonymously();
    if (signInError || !signInData?.user) {
      // Couldn't bootstrap — push them to the welcome page so they can retry.
      const welcomeUrl = request.nextUrl.clone();
      welcomeUrl.pathname = "/onboarding/welcome";
      return NextResponse.redirect(welcomeUrl);
    }
    user = signInData.user;
  }

  // (2) & (3) Onboarding gating based on user_profile.onboarded
  if (user && (isPanel || isOnboarding)) {
    const { data: profile } = await supabase
      .from("user_profile")
      .select("onboarded")
      .eq("user_id", user.id)
      .maybeSingle();

    const onboarded = profile?.onboarded === true;

    // (2) Visiting panel but not yet onboarded → redirect to welcome.
    if (isPanel && !onboarded) {
      const welcomeUrl = request.nextUrl.clone();
      welcomeUrl.pathname = "/onboarding/welcome";
      return NextResponse.redirect(welcomeUrl);
    }

    // (3) Already onboarded but visiting an onboarding step → bounce to panel.
    // Allow /onboarding/welcome through (it's a soft landing, no harm).
    if (isOnboarding && onboarded && !isOnboardingPublic) {
      const panelUrl = request.nextUrl.clone();
      panelUrl.pathname = "/panel";
      return NextResponse.redirect(panelUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
