import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import React from "react";
import "../styles/globals.css";
import CustomLayout from "./components/custom-layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider maxSnack={3}>
    <CustomLayout>
      <Component {...pageProps} />
    </CustomLayout>
    </SnackbarProvider>
  );
}

export default MyApp;
