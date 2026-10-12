import type { Metadata } from "next";
import { assetPath } from "@/lib/asset-path";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCIMate · 科研工作台",
  description: "围绕课题持续探索的科研工作台。文献、证据、雷达与下一步行动。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:`(()=>{try{const s=localStorage.getItem('scimate-theme');const t=s==='light'||s==='dark'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch{}})()`}}/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
