function escHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { name, email, message } = body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Kaikki kentät ovat pakollisia." }),
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Tarkista sähköpostiosoite." }),
    };
  }

  const safeName = escHtml(name);
  const safeEmail = escHtml(email);
  const safeMessage = escHtml(message);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Laajenna <onboarding@resend.dev>",
        to: "hei@laajenna.fi",
        reply_to: email,
        subject: `Uusi yhteydenotto — ${safeName}`,
        html: `
          <h2 style="font-family:sans-serif">Uusi yhteydenotto</h2>
          <p style="font-family:sans-serif"><strong>Nimi:</strong> ${safeName}</p>
          <p style="font-family:sans-serif"><strong>Sähköposti:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="font-family:sans-serif"><strong>Viesti:</strong></p>
          <p style="font-family:sans-serif;white-space:pre-wrap">${safeMessage}</p>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Resend error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Viestin lähetys epäonnistui." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Contact handler error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Palvelinvirhe." }),
    };
  }
};
