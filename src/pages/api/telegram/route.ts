import { NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  const body = await req.json();

  const chatId = body.message?.chat?.id;
  const text = body.message?.text;

  let reply = "Halo!";

  if (text === "/start") {
    reply = "Selamat datang di chatbot!";
  } else {
    reply = `Kamu bilang: ${text}`;
  }

  // Kirim balasan ke Telegram
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
    }),
  });

  return NextResponse.json({ status: "ok" });
}