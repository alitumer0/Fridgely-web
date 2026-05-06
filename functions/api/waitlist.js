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

  const platformLabel = { ios: "iPhone / iOS", android: "Android", both: "Her ikisi" }[platform] || platform;
  const interestLabel = {
    inventory: "Akilli envanter",
    expiry: "Son kullanma takibi",
    recipes: "AI tarif uretimi",
    family: "Aile listesi"
  }[interest] || interest;

  const results = { mail: false, kv: false, webhook: false };
  const errors = [];

  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    try {
      const fromAddress = env.NOTIFY_FROM || "Sage Waitlist <waitlist@sage.kitchen>";
      const subject = `Sage waitlist: ${email} (${platformLabel})`;
      const text = [
        `Yeni waitlist kaydi alindi.`,
        ``,
        `E-posta:   ${email}`,
        `Platform:  ${platformLabel}`,
        `Ilgi alani: ${interestLabel}`,
        `Ulke:      ${entry.ipCountry || "-"}`,
        `Tarih:     ${entry.submittedAt}`,
        `Kayit ID:  ${entry.id}`,
        ``,
        `User-Agent: ${entry.userAgent || "-"}`
      ].join("\n");

      const mailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [env.NOTIFY_EMAIL],
          reply_to: email,
          subject,
          text
        })
      });

      if (mailResponse.ok) {
        results.mail = true;
      } else {
        errors.push("resend:" + mailResponse.status);
      }
    } catch (err) {
      errors.push("resend:throw");
    }
  }

  if (env.WAITLIST_KV && typeof env.WAITLIST_KV.put === "function") {
    try {
      await env.WAITLIST_KV.put("waitlist:" + entry.id, JSON.stringify(entry));
      results.kv = true;
    } catch (err) {
      errors.push("kv:throw");
    }
  }

  if (env.WAITLIST_WEBHOOK_URL) {
    try {
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

      if (webhookResponse.ok) {
        results.webhook = true;
      } else {
        errors.push("webhook:" + webhookResponse.status);
      }
    } catch (err) {
      errors.push("webhook:throw");
    }
  }

  const anyOk = results.mail || results.kv || results.webhook;
  if (!anyOk) {
    return json(
      {
        ok: false,
        message: "Waitlist endpoint'i henuz konfigure edilmedi. Cloudflare Pages'te RESEND_API_KEY+NOTIFY_EMAIL, WAITLIST_KV veya WAITLIST_WEBHOOK_URL eklenmeli.",
        errors
      },
      503
    );
  }

  const mode = results.mail ? "mail" : results.kv ? "kv" : "webhook";

  return json({
    ok: true,
    mode,
    delivered: results,
    submittedAt: entry.submittedAt,
    nextUrl: env.TESTFLIGHT_URL || "",
    nextLabel: env.TESTFLIGHT_URL ? "TestFlight baglantisini ac" : ""
  });
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
