import React, { useEffect, useState } from "react";
import Image from "next/image";

function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

async function connect(onConnected: (address: string) => void) {
    if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

    onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(onConnected: (address: string) => void) {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length > 0) {
            const account = accounts[0];
            onConnected(account);
            return;
        }

        if (isMobileDevice()) {
            await connect(onConnected);
        }
    }
}

export default function MetaMaskAuth({ onAddressChanged }: { onAddressChanged: (address: string) => void }) {
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress);
    }, []);

    useEffect(() => {
        onAddressChanged(userAddress);
    }, [userAddress]);

    return userAddress ? (
        <div className="flex text-sm font-medium text-uni ml-4">
            <div className="pr-2">
                Connected with:
            </div>
             <Address userAddress={userAddress} />
        </div>
    ) : (
        <Connect setUserAddress={setUserAddress}/>
    );
}

function Connect({ setUserAddress }: { setUserAddress: (address: string) => void }) {
    if (typeof window !== "undefined") {
        if (isMobileDevice()) {
            const dappUrl = "metamask-auth.ilamanov.repl.co"; // TODO enter your dapp URL. For example: https://uniswap.exchange. (don't enter the "https://")
            const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
            return (
                <a href={metamaskAppDeepLink}>
                    <button className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-300 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white">
                        Connect to MetaMask
                    </button>
                </a>
            );
        }
    }

    return (
        <button className="group relative items-center flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-1 px-2 text-sm font-medium text-uni hover:bg-uni hover:text-white" onClick={() => connect(setUserAddress)}>
            <Image
                width="32"
                height="32"
                className="rounded-full"
                src="/MetaMask_Fox.svg.png"
                alt=""
            />
            <span className="text-center align-middle">Connect to Metamask</span>
        </button>
    );
}

function Address({ userAddress }: { userAddress: string }) {
    return (
        <span className="">{userAddress.substring(0, 5)}…{userAddress.substring(userAddress.length - 4)}</span>
    );
}
