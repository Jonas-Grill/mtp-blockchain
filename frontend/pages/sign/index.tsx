import React, {useEffect, useState} from "react";
import Head from "next/head";
import {initBlockchain} from "../faucet";
import Web3 from "web3";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

export default function Sign({userAddress}: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);

    const handleSign = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3) {
            const text = (event.target as any).text.value;

            // sign hashed message
            const signature = await ethereum.request({
                method: "personal_sign",
                params: [text, userAddress],
            });
            console.log({signature});

            alert("Signature: " + signature)

            const signatureTextField = document.getElementById('signature');
            if (signatureTextField) {
                signatureTextField.innerHTML = signature;
            }

            // split signature
            const r = signature.slice(0, 66);
            const s = "0x" + signature.slice(66, 130);
            const v = parseInt(signature.slice(130, 132), 16);
            console.log({r, s, v});

            const rTextField = document.getElementById('r');
            if (rTextField) {
                rTextField.innerHTML = r;
            }

            const sTextField = document.getElementById('s');
            if (sTextField) {
                sTextField.innerHTML = s;
            }

            const vTextField = document.getElementById('v');
            if (vTextField) {
                vTextField.innerHTML = v.toString();
            }

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
                    <title>Sign</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Uni Mannheim Logo"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Sign text
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSign}>
                        <label htmlFor="text" className="sr-only">
                            Text
                        </label>
                        <input
                            id="text"
                            name="text"
                            type="text"
                            required
                            className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Text to sign"
                        />
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <PencilSquareIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                  aria-hidden="true"/>
                            </span>
                            Sign this text
                        </button>
                    </form>
                    <div className="grid grid-cols-1 border-solid">
                        <div className="grid grid-cols-4 shadow shadow-uni bg-gray-300 rounded-md p-2 mb-2">
                            <p className="text-sm text-uni">Signature: </p>
                            <p id="signature" className="text-sm text-uni break-all col-span-3"></p>
                        </div>
                        <div className="grid grid-cols-4 shadow shadow-uni bg-gray-300 rounded-md p-2 mb-2">
                            <p className="text-sm text-uni">r: </p>
                            <p id="r" className="text-sm text-uni break-all col-span-3"></p>
                        </div>
                        <div className="grid grid-cols-4 shadow shadow-uni bg-gray-300 rounded-md p-2 mb-2">
                            <p className="text-sm text-uni">s: </p>
                            <p id="s" className="text-sm text-uni break-all col-span-3"></p>
                        </div>
                        <div className="grid grid-cols-4 shadow shadow-uni bg-gray-300 rounded-md p-2 mb-2">
                            <p className="text-sm text-uni">v: </p>
                            <p id="v" className="text-sm text-uni break-all col-span-3"></p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
