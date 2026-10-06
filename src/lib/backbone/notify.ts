// lib/backbone/notify.ts
// Internal team alert for every new lead, reusing the RAIO-X Telegram bot.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function notifyTeam(lines: Array<[label: string, value: string | number | null | undefined]>, title: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NOTIFY_KOMANDO_CHAT_ID;
  if (!token || !chatId) return;

  const body = lines
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `<b>${escapeHtml(k)}:</b> ${escapeHtml(String(v))}`)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `<b>${escapeHtml(title)}</b>\n\n${body}`,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.error("[backbone/notify] Telegram", res.status, await res.text());
  } catch (err) {
    console.error("[backbone/notify] Telegram error:", err);
  }
}
