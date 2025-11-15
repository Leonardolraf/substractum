import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This setup function has been disabled after initial use.
serve((_req) =>
  new Response(
    JSON.stringify({ ok: false, error: "bootstrap-create-users disabled" }),
    { status: 410, headers: { "content-type": "application/json" } }
  )
);

