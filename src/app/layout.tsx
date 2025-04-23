"use client";

import theme from "@/theme/theme";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { DialogsProvider, NotificationsProvider } from "@toolpad/core";
import localFont from "next/font/local";
import '@fontsource/inter'; 
import '@fontsource/plus-jakarta-sans';
import "./globals.css";
// import { Roboto } from 'next/font/google';

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-roboto',
// });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: '--font-geist-sans',
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: '--font-geist-mono',
  weight: "100 900",
});

export default function RootLayout({  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DialogsProvider>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </DialogsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
