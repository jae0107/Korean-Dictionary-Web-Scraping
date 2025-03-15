import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./components/Providers/Providers";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "말모이: 우리들이 만드는 사전",
//   description: "학생들의 어휘력을 향상 시키기 위한 웹 어플리케이션",
//   authors: {
//     url: 'https://github.com/jae0107',
//     name: 'Jae Choi',
//   },
//   openGraph: {
//     title: "말모이: 우리들이 만드는 사전",
//     description: "학생들의 어휘력을 향상 시키기 위한 웹 어플리케이션",
//     images: 'https://github.com/user-attachments/assets/aea63b71-0029-49a7-a8d9-62cc51f79604',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="title" property="og:title" content="말모이: 우리들이 만드는 사전" />
        <meta property="og:type" content="Website" />
        <meta name="image" property="og:image" content="https://github.com/user-attachments/assets/aea63b71-0029-49a7-a8d9-62cc51f79604" />
        <meta name="description" property="og:description" content="학생들의 어휘력을 향상 시키기 위한 웹 어플리케이션" />
        <meta name="author" content="Jae Choi" />
        <link rel="author" href="https://github.com/jae0107"/>
        <title>말모이: 우리들이 만드는 사전</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
