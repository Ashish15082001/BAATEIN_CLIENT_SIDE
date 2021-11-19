import React from "react";
import "../styles/globals.css";
import Head from "next/head";
import classes from "./index.module.css";
import ContextProvider from "../context/authcontext";
import MainNavBar from "../components/navbar/MainNavBar";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=IBM+Plex+Serif:ital,wght@1,100&family=Lobster&family=Pacifico&family=Satisfy&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ContextProvider>
        <div className={classes.mainBody}>
          <MainNavBar />
          <Component {...pageProps} />
        </div>
      </ContextProvider>
    </React.Fragment>
  );
}

export default MyApp;
