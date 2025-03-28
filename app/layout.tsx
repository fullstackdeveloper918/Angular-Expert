"use client";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
// import "../app/styles/globals.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../lib/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import { Router } from 'next/navigation';
import NProgress from 'nprogress';
import NextTopLoader from 'nextjs-toploader';
import 'nprogress/nprogress.css'; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import nookies from 'nookies';

const setCookie = (name:any, value:any, days:any) => {
  nookies.set(null, name, value, {
    maxAge: days * 24 * 60 * 60,
    path: '/',
  });
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <html lang="en">
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </head>
        <body className={inter.className}>
          {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script> */}
          {/* <AntdRegistry> */}

            <NextTopLoader  color="#2299DD"
 initialPosition={0.08}
 crawlSpeed={200}
 height={3}
 crawl={true}
 showSpinner={true}
 easing="ease"
 speed={200}
 shadow="0 0 10px #2299DD,0 0 5px #2299DD" />

          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
          {/* </AntdRegistry> */}
        </body>
      </html>
    </>
  );
}
