import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
    ClockIcon,
    DocumentPlusIcon,
    FireIcon,
    Square2StackIcon,
    UserPlusIcon
} from "@heroicons/react/20/solid";
import {initBlockchain} from "../faucet";
import {isAdmin} from "../../web3/src/entrypoints/config/admin";
import {
    addUserAdmin,
    removeUserAdmin,
    getUserAdmins,
    getContractAdmins,
    removeContractAdmin,
    addContractAdmin
} from "../../web3/src/entrypoints/config/admin";
import {
    getFaucetBlockNoDifference,
    setFaucetBlockNoDifference
} from "../../web3/src/entrypoints/config/faucet-block-no-difference";
import {getFaucetGas, setFaucetGas} from "../../web3/src/entrypoints/config/faucet-gas";
import {getFaucetBalance} from "../../web3/src/entrypoints/account/faucet";
import {getTimestampFromBlockNumber, getCurrentBlockNumber} from "../../web3/src/entrypoints/utils/utils";
import Web3 from "web3";

export default function Admin({userAddress}: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);
    const [userAdmins, setUserAdmins] = useState<string[]>([]);
    const [contractAdmins, setContractAdmins] = useState<string[][]>([]);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
    const [faucetBlockNoDifference, setFaucetBlockNoDifferenceState] = useState<number>(-1);
    const [faucetGas, setFaucetGasState] = useState<number>(-1);
    const [faucetBalance, setFaucetBalanceState] = useState<number>(-1);
    const [timestamp, setTimestamp] = useState<Date>(new Date(Date.now()));

    const handleBlockNoToDate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const blockNo = parseInt(data.get('blockNo') as string);

        getTimestampFromBlockNumber(web3, blockNo).then((result: Date) => {
            setTimestamp(result);
        }).catch((error: Error) => {
            alert(error.message);
        });
    }

    const handleAddUserAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const address = data.get("address") as string;

        if (address) {
            await addUserAdmin(web3, address).catch((error: any) => {
                alert(error.message);
            });
            setUserAdmins(await getUserAdmins(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const handleRemoveUserAdmin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const address = event.currentTarget.value;

        if (address) {
            await removeUserAdmin(web3, address).catch((error: any) => {
                alert(error.message);
            });
            setUserAdmins(await getUserAdmins(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const handleAddContractAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const address = data.get("address") as string;
        const contract = data.get("contract") as string;

        if (address && contract) {
            await addContractAdmin(web3, address, contract).catch((error: any) => {
                alert(error.message);
            });
            setContractAdmins(await getContractAdmins(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const handleRemoveContractAdmin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const address = event.currentTarget.value;

        if (address) {
            await removeContractAdmin(web3, address).catch((error: any) => {
                alert(error.message);
            });
            setContractAdmins(await getContractAdmins(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const handleSetFaucetBlockNoDifference = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const blockNoDifference = data.get("blockNoDifference") as string;

        if (blockNoDifference) {
            await setFaucetBlockNoDifference(web3, parseInt(blockNoDifference)).catch((error: any) => {
                alert(error.message);
            });
            setFaucetBlockNoDifferenceState(await getFaucetBlockNoDifference(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const handleSetFaucetGas = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const gas = data.get("gas") as string;

        if (gas) {
            await setFaucetGas(web3, parseInt(gas)).catch((error: any) => {
                alert(error.message);
            });
            setFaucetGasState(await getFaucetGas(web3).catch((error: any) => {
                alert(error.message);
            }));
        }
    }

    const zeroAddressFilter = (address: string) => {
        return !web3.utils.toBN(address).isZero();
    }

    useEffect(() => {
        console.log("Admin page useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (userAdmins.length <= 0) {
            getUserAdmins(web3).then((result: string[]) => {
                result = result.filter(zeroAddressFilter);
                setUserAdmins(result);
            });
        } else if (contractAdmins.length <= 0) {
            getContractAdmins(web3).then((result: string[][]) => {
                result = result.filter((contractAdmin: string[]) => {
                    return zeroAddressFilter(contractAdmin[1]);
                });
                setContractAdmins(result);
            });
        } else if (faucetBlockNoDifference < 0) {
            getFaucetBlockNoDifference(web3).then((result) => {
                setFaucetBlockNoDifferenceState(result);
            });
        } else if (faucetGas < 0) {
            getFaucetGas(web3).then((result) => {
                setFaucetGasState(result);
            });
        } else if (faucetBalance < 0) {
            getFaucetBalance(web3).then((result) => {
                setFaucetBalanceState(result);
            });
        } else {
            getCurrentBlockNumber(web3).then((result) => {
                getTimestampFromBlockNumber(web3, result).then((result: Date) => {
                    setTimestamp(result);
                });
            });
        }
        if (web3 && userAddress) {
            isAdmin(web3, userAddress).then((result) => {
                setIsUserAdmin(result);
            });
        }
    }, [web3, userAdmins, contractAdmins, userAddress, faucetBlockNoDifference, faucetGas, faucetBalance]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Admin</title>
                </Head>
                <div className="bg-white">
                    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8">
                        {
                            isUserAdmin ? (

                                <div className="grid grid-cols-1 gap-y-2 gap-x-6 l:gap-x-8 justify-center">
                                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                                        Admin functions
                                    </h2>
                                    <div className="mt-2 shadow shadow-uni bg-gray-300 rounded-md p-2 divide-uni divide-y">
                                        <form className="pt-2 grid grid-cols-3 justify-items-start items-center mb-1"
                                              onSubmit={handleBlockNoToDate}>
                                            <label htmlFor="blockNo" className="sr-only">
                                                BlockNoToDate
                                            </label>
                                            <input
                                                id="blockNo"
                                                name="blockNo"
                                                type="number"
                                                min={0}
                                                required
                                                className="col-span-2 relative block w-64 appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                placeholder="Block number"
                                            />
                                            <button
                                                type="submit"
                                                className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-6 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <ClockIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                                  aria-hidden="true"/>
                                                </span>
                                                To date
                                            </button>
                                        </form>
                                        <div className="grid grid-cols-3 justify-items-start items-center">
                                            <h3 className="mt-1 text-lg font-medium text-uni col-span-2">Block number to timestamp: {`${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-4 shadow shadow-uni bg-gray-300 rounded-md p-2 divide-uni divide-y">
                                        <h3 className="mt-1 text-lg font-medium text-uni">User admin addresses:</h3>
                                        <div className="divide-y divide-uni">
                                            {userAdmins.map((userAdmin) => (
                                                <div key={userAdmin}
                                                     className="grid grid-cols-3 justify-items-start items-center">
                                                    <div className="col-span-2">
                                                        <h3 className="text-sm font-medium text-uni col-span-2">{userAdmin}</h3>
                                                    </div>
                                                    <button value={userAdmin} name={userAdmin} onClick={handleRemoveUserAdmin}
                                                            className="mt-1 mb-1 ml-8 shadow shadow-uni rounded-md flex w-1/2 items-center justify-center py-3 px-3 text-center font-medium text-uni bg-gray-400 hover:bg-uni hover:text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <form className="pt-2 grid grid-cols-3 justify-items-start items-center"
                                              onSubmit={handleAddUserAdmin}>
                                            <label htmlFor="address" className="sr-only">
                                                addUserAdmin
                                            </label>
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                required
                                                className="col-span-2 relative block w-64 appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                placeholder="User admin address"
                                            />
                                            <button
                                                type="submit"
                                                className="group relative flex w-full justify-end rounded-md shadow shadow-uni bg-gray-400 py-2 px-6 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <UserPlusIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                                  aria-hidden="true"/>
                                                </span>
                                                Add user admin
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-2 shadow shadow-uni bg-gray-300 rounded-md p-2 divide-uni divide-y">
                                        <h3 className="mt-1 text-lg font-medium text-uni">Contract admin addresses:</h3>
                                        <div className="divide-y divide-uni">
                                            {contractAdmins.map((contractAdmin) => (
                                                <div key={contractAdmin.toString()}
                                                     className="grid grid-cols-3 justify-items-start items-center">
                                                    <div className="col-span-2">
                                                        <h3 className="mt-1 text-sm font-medium text-uni">{contractAdmin[0]}</h3>
                                                        <h3 className="mt-1 mb-1 text-sm font-medium text-uni">{contractAdmin[1]}</h3>
                                                    </div>
                                                    <button value={contractAdmin[1]} name={contractAdmin.toString()}
                                                            onClick={handleRemoveContractAdmin}
                                                            className="ml-8 rounded-md shadow shadow-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-uni bg-gray-400 hover:bg-uni hover:text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <form className="pt-2 grid grid-cols-3 justify-items-start items-center"
                                              onSubmit={handleAddContractAdmin}>
                                            <div className="col-span-2">
                                                <label htmlFor="address" className="sr-only">
                                                    addContractAddress
                                                </label>
                                                <input
                                                    id="address"
                                                    name="address"
                                                    type="text"
                                                    required
                                                    className="w-64 block appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                    placeholder="Contract admin address"
                                                />
                                                <label htmlFor="contract" className="sr-only">
                                                    addContract
                                                </label>
                                                <input
                                                    id="contract"
                                                    name="contract"
                                                    type="text"
                                                    required
                                                    className="w-64 mt-2 block appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                    placeholder="Contract admin name"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="group relative flex w-full justify-end rounded-md shadow shadow-uni bg-gray-400 py-2 px-2 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <DocumentPlusIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                                      aria-hidden="true"/>
                                                </span>
                                                Add contract admin
                                            </button>
                                        </form>
                                    </div>
                                    <div
                                        className="mt-2 shadow shadow-uni bg-gray-300 rounded-md p-2">
                                        <div className="grid grid-cols-3 justify-items-start items-center">
                                            <h3 className="mt-1 text-lg font-medium text-uni col-span-2">Current Block
                                                number difference:</h3>
                                            <h3 className="mt-1 text-lg font-medium text-uni ml-16">{faucetBlockNoDifference}</h3>
                                        </div>
                                        <form className="mt-2 grid grid-cols-3 justify-items-start items-center"
                                              onSubmit={handleSetFaucetBlockNoDifference}>
                                            <label htmlFor="blockNoDifference" className="sr-only">
                                                faucetBlockNoDifference
                                            </label>
                                            <input
                                                id="blockNoDifference"
                                                name="blockNoDifference"
                                                type="text"
                                                required
                                                className="col-span-2 relative block w-64 appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                placeholder="faucet block number difference"
                                            />
                                            <button
                                                type="submit"
                                                className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Square2StackIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                              aria-hidden="true"/>
                                                </span>
                                                Set difference
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-2 shadow shadow-uni bg-gray-300 rounded-md p-2">
                                        <div className="grid grid-cols-3 justify-items-start items-center">
                                            <h3 className="mt-1 text-lg font-medium text-uni col-span-2">Current faucet
                                                gas:</h3>
                                            <h3 className="mt-1 text-lg font-medium text-uni ml-16">{faucetGas}</h3>
                                        </div>
                                        <form className="mt-2 grid grid-cols-3 justify-items-start items-center"
                                              onSubmit={handleSetFaucetGas}>
                                            <label htmlFor="gas" className="sr-only">
                                                gasAmount
                                            </label>
                                            <input
                                                id="gas"
                                                name="gas"
                                                type="text"
                                                required
                                                className="col-span-2 relative block w-64 appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                                                placeholder="gas amount"
                                            />
                                            <button
                                                type="submit"
                                                className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <FireIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                            aria-hidden="true"/>
                                                </span>
                                                Set faucet gas
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-2 shadow shadow-uni bg-gray-300 rounded-md p-2 divide-uni divide-y">
                                        <div className="grid grid-cols-3 justify-items-start items-center">
                                            <h3 className="mt-1 text-lg font-medium text-uni col-span-2">Amount of Eth in faucet
                                                contract:</h3>
                                            <h3 className="mt-1 text-lg font-medium text-uni ml-16">{Web3.utils.fromWei(faucetBalance.toString(), 'ether')}</h3>
                                        </div>
                                        <div className="grid grid-cols-3 justify-items-start items-center">
                                            <h3 className="mt-1 text-lg font-medium text-uni col-span-2">Amount of Eth in faucet
                                                API:</h3>
                                            <h3 className="mt-1 text-lg font-medium text-uni ml-16">{faucetGas}</h3>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
