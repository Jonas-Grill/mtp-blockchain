import Head from "next/head";
import React, {useEffect, useState} from "react";
import {loadSemesters, Semester} from "../semester";
import {initBlockchain} from "../faucet";
import {getKnowledgeCoinBalance} from "../../web3/src/entrypoints/account/faucet"

export default function coinOverview({ userAddress }: { userAddress: string }) {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [web3, setWeb3] = useState<any>(undefined);
    const [coins, setCoins] = useState<number>(0);

    const getSemesterById = (id: string) => {
        return semesters.find((semester) => semester.id === id);
    }

    const getMissingCoins = () => {
        const semester = getSemesterById(selectedSemester);

        if (selectedSemester === "") return 0;
        if (semester === undefined) return 0;

        return semester.minKnowledgeCoinAmount - coins;
    }

    useEffect(() => {
        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesters.length <= 0) {
            loadSemesters(web3).then((result) => {
                setSemesters(result);
                setSelectedSemester(result[0].id);
            });
        } else {
            getKnowledgeCoinBalance(web3, userAddress).then((result) => {
                setCoins(result);
            });
        }
    }, [web3, semesters, selectedSemester]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Coin overview</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Knowledge overview
                        </h2>
                        <fieldset>
                            <div className="mt-4 space-y-4">
                                {semesters.map((semester) => (
                                    <div className="flex items-center">
                                        <input
                                            id={semester.id}
                                            name="semester"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={semester.id === selectedSemester}
                                            onChange={() => setSelectedSemester(semester.id)}
                                        />
                                        <label htmlFor="semester"
                                               className="ml-3 block text-sm font-medium text-gray-700">
                                            {semester.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                        <div
                            className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-4 gap-x-8 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Knowledge needed for
                                    exam:
                                </dt>
                                <dt className="text-lg font-medium text-gray-900 text-right">{getSemesterById(selectedSemester)?.minKnowledgeCoinAmount}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Your current knowledge:
                                </dt>
                                <dt className="text-lg font-medium text-green-600 text-right">{coins}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Your missing knowledge:
                                </dt>
                                <dt className="text-lg font-medium text-red-600 text-right">{getMissingCoins()}</dt>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
