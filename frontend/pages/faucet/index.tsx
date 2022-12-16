import { FireIcon } from '@heroicons/react/20/solid'
import { send_gas } from '../../web3/src/entrypoints/account/faucet'
import React, { useEffect } from "react";

const Web3 = require("web3");


export default function Faucet({ userAddress }: { userAddress: string }) {
    let web3;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!web3) {
            web3 = new Web3(window.ethereum);
        }

        const result = await send_gas(web3, event.currentTarget.address.value);
        alert(JSON.stringify(result))
    }

    useEffect(() => {
        window.addEventListener('load', async () => {
            // Wait for loading completion to avoid race conditions with web3 injection timing.
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                } catch (error) {
                    console.error(error);
                }
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);
                web3 = new Web3(provider);
                console.log('No web3 instance injected, using Local web3.');
            }
        });
    }, []);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
