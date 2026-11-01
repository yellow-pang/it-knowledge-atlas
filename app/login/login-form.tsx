"use client";
import { useState } from "react";
export function LoginForm() {
  const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    try { const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.get("username"), password: form.get("password") }) });
      if (!response.ok) { const data = await response.json(); setError(data.error); return; }
      window.location.replace("/");
    } catch { setError("연결하지 못했습니다. 다시 시도해 주세요."); } finally { setPending(false); }
  }
  return <form className="login-form" onSubmit={submit}><label>계정<input name="username" autoComplete="username" required maxLength={128} /></label><label>비밀번호<input name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label><button disabled={pending}>{pending ? "로그인 중…" : "로그인"}</button><p role="alert">{error}</p></form>;
}
