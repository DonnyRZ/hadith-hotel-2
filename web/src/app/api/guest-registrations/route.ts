export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/visitorIdentity";
import { validateGuestRegistration } from "@/lib/guestRegistration";
import { appendGuestRegistrationRow } from "@/lib/googleSheets";

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response({ ok: false }, 403);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return response({ ok: false }, 400);
  }

  const result = validateGuestRegistration(payload);
  if (!result.valid) {
    // Honeypot / too-fast submissions are treated as silent bot traffic —
    // respond as if successful so scrapers gain no signal, without writing data.
    if (result.errors.honeypot || result.errors.renderedAt) {
      return response({ ok: true });
    }
    return response({ ok: false, errors: result.errors }, 422);
  }

  try {
    const registration = await prisma.guestRegistration.create({
      data: result.data,
    });

    try {
      await appendGuestRegistrationRow(registration);
      await prisma.guestRegistration.update({
        where: { id: registration.id },
        data: { syncedToSheetAt: new Date() },
      });
    } catch (syncError) {
      console.error("Guest registration sheet sync failed", syncError);
      await prisma.guestRegistration
        .update({
          where: { id: registration.id },
          data: {
            syncError:
              syncError instanceof Error ? syncError.message : "unknown error",
          },
        })
        .catch(() => {});
    }

    return response({ ok: true });
  } catch (error) {
    console.error("Guest registration save failed", error);
    return response({ ok: false }, 503);
  }
}
