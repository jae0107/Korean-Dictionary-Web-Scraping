import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./components/Providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "말모이: 우리들이 만드는 사전",
  description: "학생들의 어휘력을 향상 시키기 위한 웹 어플리케이션",
  authors: {
    url: 'https://github.com/jae0107',
    name: 'Jae Choi',
  },
  openGraph: {
    title: "말모이: 우리들이 만드는 사전",
    description: "학생들의 어휘력을 향상 시키기 위한 웹 어플리케이션",
    images: [
      {
        url: '<img width="1507" alt="Screenshot 2025-03-16 at 2 27 32 am" src="https://github.com/user-attachments/assets/aea63b71-0029-49a7-a8d9-62cc51f79604" />',
        width: 1507,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
