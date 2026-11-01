import { authenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await authenticated()) redirect("/");
  return <main className="shell login-shell"><header className="site-header"><span className="brand">IT KNOWLEDGE ATLAS</span></header><section className="intro"><p className="eyebrow">WELCOME BACK</p><h1>오늘의 학습을<br />시작해 볼까요?</h1><p>개인 계정으로 로그인해 주세요.</p><LoginForm /></section></main>;
}
