import { FireIcon } from '@heroicons/react/20/solid'
import { sendEth } from '../../web3/src/entrypoints/account/faucet'
import React, { useEffect, useState } from "react";
import Head from "next/head";

const Web3 = require("web3");

export default function Faucet({ userAddress }: { userAddress: string }) {
    let web3;
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        alert(await web3.eth.getBalance(userAddress))

        await sendEth(web3, userAddress);
    }

    useEffect(() => {
        const initBlockchain = async () => {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
            } else if (web3) {
                web3 = new Web3(web3.currentProvider);
            } else {
                console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
            }

            console.log("Successfully loaded web3...")
        }

        initBlockchain()
            // make sure to catch any error
            .catch(console.error);
    }, []);

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
                            Get your gas now
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
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
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
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                placeholder="Wallet address"
                            />
                        }

                        <button
                            type="submit"

                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FireIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                    aria-hidden="true" />
                            </span>
                            Get gas
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
