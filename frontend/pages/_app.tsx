import "../styles/globals.css"
import type {AppProps} from 'next/app'
import Navbar from "../components/Navbar";
import {useState} from "react";

export const BASE_URL = "http://localhost:9090/api/v1";

export default function MyApp({Component, pageProps}: AppProps) {
    const [userAddress, setUserAddress] = useState("");

    const setUserAddressCallback = (address: string) => {
        setUserAddress(address);

        window.ethereum.request({
            method: 'personal_sign',
            params: ["Hello", address],
        }).then(signature => {
            console.log("Signature: " + signature);
        });

        // fetch(`${BASE_URL}/account/jwt/generate_token`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         address: address,
        //     })
        // }).then(response => response.json().then(data => {
        //     window.ethereum.request({
        //         method: 'eth_sign',
        //         params: [address, data],
        //     }).then(signature => {
        //         console.log(signature);
        //     });
        // }));
    }

    return (
        <>
            <Navbar setUserAddress={setUserAddressCallback}/>
            <Component {...pageProps} userAddress={userAddress}/>
        </>
    )
}
