import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT Knowledge Atlas",
  description: "IT 개념을 연결하고 꾸준히 학습하는 공간",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
