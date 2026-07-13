import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

/**
 * Verifies portfolio_settings exists after you run the migration SQL in
 * Supabase Dashboard → SQL Editor.
 *
 * SQL file: supabase/migrations/001_portfolio_settings.sql
 * Open: https://supabase.com/dashboard/project/mqkonlozjkseygirxbgo/sql/new
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dirname, "..", ".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const probe = await admin
  .from("portfolio_settings")
  .select("key, value")
  .eq("key", "section_order")
  .maybeSingle();

if (probe.error) {
  console.error("Table missing or RLS blocking:", probe.error.message);
  console.error("\nRun supabase/migrations/001_portfolio_settings.sql in SQL Editor:");
  console.error("https://supabase.com/dashboard/project/mqkonlozjkseygirxbgo/sql/new\n");
  process.exit(1);
}

console.log("OK — section_order:", JSON.stringify(probe.data?.value));
