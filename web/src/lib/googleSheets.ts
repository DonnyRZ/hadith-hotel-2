/** Best-effort append of guest registrations to the shared operations Google Sheet. */

import { google } from "googleapis";
import type { GuestRegistration } from "@prisma/client";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function credentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !key || !spreadsheetId) return null;
  return {
    email,
    key: key.includes("\\n") ? key.replace(/\\n/g, "\n") : key,
    spreadsheetId,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1",
  };
}

export function hasGoogleSheetsConfig(): boolean {
  return credentials() !== null;
}

function formatArrivalDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const SUBMITTED_AT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** e.g. "12 Aug 2026, 14:40" (Jakarta time) — readable for the ops team in the sheet. */
function formatSubmittedAt(date: Date): string {
  return SUBMITTED_AT_FORMATTER.format(date);
}

export async function appendGuestRegistrationRow(
  registration: GuestRegistration,
): Promise<void> {
  const config = credentials();
  if (!config) return;

  const auth = new google.auth.JWT({
    email: config.email,
    key: config.key,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: "v4", auth });

  const row = [
    formatSubmittedAt(registration.createdAt),
    registration.name,
    registration.surname,
    registration.position,
    registration.phone,
    registration.email,
    formatArrivalDate(registration.arrivalDate),
    registration.hasCompanions ? "Yes" : "No",
    registration.companionsCount,
    registration.totalGuests,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    // Column A is reserved for the "No" cumulative-headcount formula set up
    // directly in the sheet; the append range starts at B so it's never
    // overwritten.
    range: `${config.sheetName}!B:K`,
    // RAW keeps strings literal (e.g. a leading "+" on phone numbers survives;
    // USER_ENTERED would parse it as a number and drop the "+").
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
