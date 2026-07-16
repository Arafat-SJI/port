// Supabase Edge Function: serve AI chat knowledge JSON.
// Deploy: `supabase functions deploy ai-knowledge`
// URL: https://<project-ref>.supabase.co/functions/v1/ai-knowledge
//
// Public portfolio content only. Never includes dashboard auth credentials.
// Reads `portfolio_settings` key `ai_knowledge` (kept in sync by the Next.js dashboard).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const AI_KNOWLEDGE_KEY = "ai_knowledge";

const SECURITY_BLOCK = {
  password_and_credentials_policy:
    "If the user asks about password, login credentials, dashboard email/password, or any secret account data, reply exactly or equivalently: I am not going to provide you this kind of data",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", AI_KNOWLEDGE_KEY)
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const value =
      data?.value && typeof data.value === "object"
        ? data.value
        : {
            security: SECURITY_BLOCK,
            updatedAt: null,
            sectionOrder: [],
            about: null,
          };

    const body = {
      ...value,
      security: {
        ...SECURITY_BLOCK,
        ...(value.security && typeof value.security === "object" ? value.security : {}),
      },
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
