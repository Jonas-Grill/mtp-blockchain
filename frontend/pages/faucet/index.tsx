import { FireIcon } from '@heroicons/react/20/solid'
import { sendEth } from '../../web3/src/entrypoints/account/faucet'
import React, {useEffect, useState} from "react";
import Head from "next/head";
import Web3 from "web3";

export const initBlockchain = async (web3: any) => {
    // @ts-ignore
    if (window && window.ethereum) {
        // @ts-ignore
        web3 = new Web3(window.ethereum);
        // @ts-ignore
        await window.ethereum.enable();

        const chainId = await web3.eth.getChainId();

        console.log(chainId);

        if (chainId != parseInt(process.env.NETWORK_ID || "1337")) {
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

export default function Faucet(this: any, { userAddress }: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const button = event.currentTarget.querySelector("button");

        if (web3 && button) {
            button.disabled = true;

            web3.eth.getBalance(userAddress).then((result: any) => {
                const balance = web3.utils.fromWei(result, "ether");

                if (balance > 0.2) {
                    sendEth(web3, userAddress).then(() => {
                        alert("Gas sent!");
                        button.disabled = false;
                    }).catch((error: any) => {
                        alert(error.message);
                        button.disabled = false;
                    });
                } else {
                    fetch(process.env.FAUCET_URL + "/sendEth", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "toAddress": userAddress
                        }),
                    }
                    ).then(response => {
                        if (response.status == 200) {
                            alert("Gas sent!");
                        } else {
                            alert("Error: " + response.status);
                        }
                        button.disabled = false;
                    }).catch((error) => {
                        alert(error.message);
                        button.disabled = false;
                    });
                }
            }).catch((error: any) => {
                alert(error.message);
                button.disabled = false;
            });
        }
    }

    useEffect(() => {
        console.log("Faucet useEffect");

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
                            disabled={false}
                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-500 hover:bg-uni hover:text-white"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FireIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                    aria-hidden="true" />
                            </span>
                            Get gas
                        </button>
                    </form>
                    <div className="mt-4 text-lg font-medium text-uni">
                        This button is disabled, if you have an ongoing faucet request.
                    </div>
                </div>
            </div>
        </>
    )
}
