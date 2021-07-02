import React from "react";
import "../styles/globals.css";
import CustomLayout from "./components/custom-layout";

function MyApp({ Component, pageProps }) {
  return (
    <CustomLayout>
      <Component {...pageProps} />
    </CustomLayout>
  );
}

export default MyApp;
