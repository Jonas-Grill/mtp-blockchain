import "../styles/globals.css"
import type {AppProps} from 'next/app'
import Navbar from "../components/Navbar";
import {SetStateAction, useEffect, useState} from "react";
import {initBlockchain} from "./faucet";

export default function MyApp({Component, pageProps}: AppProps) {
    const [userAddress, setUserAddress] = useState("");
    const [web3, setWeb3] = useState<any>();
    const [chainId, setChainId] = useState(0);

    useEffect(() => {
        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else {
            web3.eth.getChainId().then((chainId: number) => {
                console.log(chainId);
                setChainId(chainId);
            });
        }
    }, [web3, chainId]);

    if (!web3) {
        return (
            <>
                <Navbar setUserAddress={setUserAddress}/>
                <div>You need metamask to use this web app</div>
            </>
        )
    } else {
        if (chainId !== parseInt(process.env.NETWORK_ID || "-1")) {
            return (
                <>
                    <Navbar setUserAddress={setUserAddress}/>
                    <div>You need to connect to the correct network</div>
                </>
            )
        } else {
            return (
                <>
                    <Navbar setUserAddress={setUserAddress}/>
                    <Component {...pageProps} userAddress={userAddress}/>
                </>
            )
        }
    }
}
