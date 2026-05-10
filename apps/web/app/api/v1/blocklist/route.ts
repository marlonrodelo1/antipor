import { NextResponse } from "next/server";
import blocklist from "@/data/blocklist.json";

export const dynamic = "force-static";

/**
 * Returns the current signed blocklist version. The mobile clients
 * sync this periodically. The list itself is a placeholder of dummy
 * `.invalid` domains in development — the real curated list will be
 * added before launch.
 */
export async function GET() {
  return NextResponse.json(blocklist, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=600",
    },
  });
}
