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
    registration.createdAt.toISOString(),
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
    range: `${config.sheetName}!A:J`,
    // RAW keeps strings literal (e.g. a leading "+" on phone numbers survives;
    // USER_ENTERED would parse it as a number and drop the "+").
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
