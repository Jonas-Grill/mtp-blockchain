import Navbar from "../../components/Navbar";

import {LockClosedIcon, FireIcon} from '@heroicons/react/20/solid'
import MetaMaskAuth from "../../components/MetaMaskAuth";

export default function Faucet() {
    return (
        <>
            <Navbar/>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Get your gas now
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <input type="hidden" name="remember" defaultValue="true"/>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Wallet address
                                </label>
                                <input
                                    id="wallet-address"
                                    name="walletAddress"
                                    type="walletAddress"
                                    autoComplete="walletAddress"
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                    placeholder="Wallet address"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                            >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FireIcon className="h-5 w-5 text-uni group-hover:text-gray-400" aria-hidden="true"/>
                </span>
                                Get gas
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}