import {FireIcon} from '@heroicons/react/20/solid'
import {sendEth} from '../../web3/src/entrypoints/account/faucet'
import React, {useEffect, useState} from "react";
import Head from "next/head";
import Web3 from "web3";

export const initBlockchain = async (web3: any) => {
    if (window && window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const chainId = await web3.eth.getChainId();

        if (chainId != 1337) {
            alert("You are using the wrong chain!")
            web3 = undefined;
        }
    } else if (web3) {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    return web3;
}

export default function Faucet({userAddress}: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3) {
            web3.eth.getBalance(userAddress).then((result: any) => {
                const balance = web3.utils.fromWei(result, "ether");

                if (balance > 0.2) {
                    sendEth(web3, userAddress);
                } else {
                    fetch("http://localhost:8080/sendEth", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                toAddress: userAddress,
                            }),
                        }
                    ).catch((error) => {
                        alert(error.message);
                    });
                }
            }).catch((error: any) => {
                alert(error.message);
            });
        }
    }

    useEffect(() => {
        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        }
    }, [web3]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Faucet</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Uni Mannheim Logo"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Get your ETH now
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <label htmlFor="wallet-address" className="sr-only">
                            Wallet address
                        </label>

                        {userAddress ?
                            <input
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="walletAddress"
                                required
                                className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                placeholder="Wallet address"
                                value={userAddress}
                                readOnly
                            /> :
                            <input
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="walletAddress"
                                required
                                className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                placeholder="Wallet address"
                            />
                        }

                        <button
                            type="submit"

                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FireIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                          aria-hidden="true"/>
                            </span>
                            Get gas
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
