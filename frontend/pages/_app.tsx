import "../styles/globals.css"
import type {AppProps} from 'next/app'
import Navbar from "../components/Navbar";
import {useEffect, useState} from "react";
import {initBlockchain} from "./faucet";

export default function MyApp({Component, pageProps}: AppProps) {
    const [userAddress, setUserAddress] = useState("");
    const [web3, setWeb3] = useState<any>();
    const [chainId, setChainId] = useState(0);

    useEffect(() => {
        console.log("App useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
                setUserAddress(web3.eth.accounts[0]);
            });
        } else {
            setUserAddress(web3.eth.accounts[0]);

            web3.eth.getChainId().then((result: number) => {
                if (result !== chainId) {
                    setChainId(result);
                }
            }).catch((reason: any) => {
                console.log(reason);
            });
        }
    }, [web3, chainId]);

    if (!web3) {
        return (
            <>
                <Navbar setUserAddress={setUserAddress} userAddress={userAddress} web3={web3} setWeb3={setWeb3}/>
                <Component {...pageProps} userAddress={userAddress}/>
                <div className="mt-2 text-center text-lg font-medium tracking-tight text-gray-900">You need metamask to use this web app</div>
            </>
        )
    } else {
        if (chainId !== parseInt(process.env.NETWORK_ID || "-1")) {
            return (
                <>
                    <Navbar setUserAddress={setUserAddress} userAddress={userAddress} web3={web3} setWeb3={setWeb3}/>
                    <Component {...pageProps} userAddress={userAddress}/>
                    <div className="mt-2 text-center text-lg font-medium tracking-tight text-gray-900">You need to connect to the correct network</div>
                </>
            )
        } else {
            return (
                <>
                    <Navbar setUserAddress={setUserAddress} userAddress={userAddress} web3={web3} setWeb3={setWeb3}/>
                    <Component {...pageProps} userAddress={userAddress}/>
                </>
            )
        }
    }
}
