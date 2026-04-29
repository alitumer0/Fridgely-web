export async function onRequestPost(context) {
  const { request, env } = context;
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json(
      {
        ok: false,
        message: "Gecersiz istek govdesi. JSON bekleniyor."
      },
      400
    );
  }

  const email = String(payload?.email || "").trim().toLowerCase();
  const platform = String(payload?.platform || "").trim();
  const interest = String(payload?.interest || "").trim();
  const createdAt = String(payload?.createdAt || new Date().toISOString());

  if (!isValidEmail(email)) {
    return json(
      {
        ok: false,
        message: "Lutfen gecerli bir e-posta adresi girin."
      },
      400
    );
  }

  if (!["ios", "android", "both"].includes(platform)) {
    return json(
      {
        ok: false,
        message: "Lutfen gecerli bir platform secin."
      },
      400
    );
  }

  if (!["inventory", "expiry", "recipes", "family"].includes(interest)) {
    return json(
      {
        ok: false,
        message: "Lutfen gecerli bir ilgi alani secin."
      },
      400
    );
  }

  const entry = {
    id: crypto.randomUUID(),
    email,
    platform,
    interest,
    createdAt,
    source: "sage-web",
    userAgent: request.headers.get("user-agent") || "",
    ipCountry: request.cf?.country || "",
    submittedAt: new Date().toISOString()
  };

  if (env.WAITLIST_WEBHOOK_URL) {
    const webhookResponse = await fetch(env.WAITLIST_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.WAITLIST_WEBHOOK_BEARER_TOKEN
          ? { Authorization: "Bearer " + env.WAITLIST_WEBHOOK_BEARER_TOKEN }
          : {})
      },
      body: JSON.stringify(entry)
    });

    if (!webhookResponse.ok) {
      return json(
        {
          ok: false,
          message: "Waitlist servisi simdilik gonderimi kabul etmedi. Lutfen daha sonra tekrar deneyin."
        },
        502
      );
    }

    return json({
      ok: true,
      mode: "webhook",
      submittedAt: entry.submittedAt,
      nextUrl: env.TESTFLIGHT_URL || "",
      nextLabel: env.TESTFLIGHT_URL ? "TestFlight baglantisini ac" : ""
    });
  }

  if (env.WAITLIST_KV && typeof env.WAITLIST_KV.put === "function") {
    await env.WAITLIST_KV.put("waitlist:" + entry.id, JSON.stringify(entry));

    return json({
      ok: true,
      mode: "kv",
      submittedAt: entry.submittedAt,
      nextUrl: env.TESTFLIGHT_URL || "",
      nextLabel: env.TESTFLIGHT_URL ? "TestFlight baglantisini ac" : ""
    });
  }

  return json(
    {
      ok: false,
      message: "Waitlist endpoint'i henuz konfigure edilmedi. Cloudflare Pages'te WAITLIST_WEBHOOK_URL veya WAITLIST_KV baglantisi eklenmeli."
    },
    503
  );
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
