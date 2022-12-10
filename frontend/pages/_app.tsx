import "../styles/globals.css"
import type { AppProps } from 'next/app'
import Navbar from "../components/Navbar";
import { useState } from "react";

export const BASE_URL = "http://localhost:9090/api/v1";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [userAddress, setUserAddress] = useState("");

    return (
        <>
            <Navbar setUserAddress={setUserAddress} />
            <Component {...pageProps} userAddress={userAddress} />
        </>
    )
}
