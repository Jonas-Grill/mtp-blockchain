import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getSemester, getSemesterIds, deleteSemester} from "../../web3/src/entrypoints/config/semester"
import Head from "next/head";
import {AcademicCapIcon} from "@heroicons/react/20/solid";
import {initBlockchain} from "../faucet";
import {isAdmin} from "../../web3/src/entrypoints/config/admin";
import {getCurrentBlockNumber} from "../../web3/src/entrypoints/utils/utils";

// Export semester type
export type Semester = {
    id: string,
    name: string,
    startBlock: number,
    endBlock: number,
    minKnowledgeCoinAmount: number
}

export const loadSemesters = async (web3: any, isAdmin: boolean) => {
    if (web3) {
        const semesters: Semester[] = [];
        const ids: string[] = await getSemesterIds(web3);

        for (let id of ids) {
            const semester = await getSemester(web3, id);

            if (semester) {
                semesters.push({
                    id: id,
                    name: semester.name,
                    startBlock: semester.startBlock,
                    endBlock: semester.endBlock,
                    minKnowledgeCoinAmount: semester.minKnowledgeCoinAmount
                });
            }
        }

        if (isAdmin) {
            return semesters.sort((a, b) => b.startBlock - a.startBlock);
        } else {
            const currentBlockNumber = await getCurrentBlockNumber(web3);
            return semesters.filter(semester => semester.endBlock > currentBlockNumber && semester.startBlock < currentBlockNumber).sort((a, b) => b.startBlock - a.startBlock);
        }
    }
}

export const loadSemester = async (web3: any, id: string) => {
    if (web3) {
        const semester = await getSemester(web3, id);

        return {
            id: id,
            name: semester.name,
            startBlock: semester.startBlock,
            endBlock: semester.endBlock,
            minKnowledgeCoinAmount: semester.minKnowledgeCoinAmount
        }
    }
}

export default function SemesterOverview({userAddress}: { userAddress: string }) {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [web3, setWeb3] = useState<any>(undefined);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

    const handleDeleteSemester = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (web3) {
            deleteSemester(web3, event.currentTarget.name).then(() => {
                loadSemesters(web3, isUserAdmin).then((semesters) => {
                    if (semesters) {
                        setSemesters(semesters);
                    }
                });
            }).catch((error: any) => {
                alert(error.message);
            });
        }
    }

    useEffect(() => {
        console.log("Semester overview useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else {
            loadSemesters(web3, isUserAdmin).then((result) => {
                if (result) {
                    setSemesters(result.sort((a, b) => b.startBlock - a.startBlock));
                }
            });
        }
        if (userAddress && web3) {
            isAdmin(web3, userAddress).then((result) => {
                if (result && result !== isUserAdmin) {
                    setIsUserAdmin(result);
                }
            });
        }
    }, [web3, userAddress, isUserAdmin]);

    return (
        <div className="flex-col">
            <Head>
                <title>Semester overview</title>
            </Head>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8 mt-10">

                    {
                        isUserAdmin ? (
                            <div className="mt-10">
                                <Link href={"/semester/createSemester"}
                                      className="w-3/4 max-w-md space-y-8"
                                >
                                    <button
                                        type="button"
                                        className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                    >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AcademicCapIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                     aria-hidden="true"/>
                                </span>
                                        Add new semester
                                    </button>
                                </Link>
                            </div>
                        ) : null
                    }

                    <div
                        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {semesters.map((semester) => (
                            <div className="mt-4 shadow shadow-uni bg-gray-300 rounded-md p-2" key={semester.id}>
                                <h3 className="mt-1 text-lg font-medium text-uni">Semester: {semester.name}</h3>
                                <p className="mt-4 text-sm text-uni">Coin amount for
                                    exam: {semester.minKnowledgeCoinAmount}</p>
                                <p className="mt-4 text-sm text-uni">Starting block: {semester.startBlock}</p>
                                <p className="mt-4 text-sm text-uni">End block: {semester.endBlock}</p>
                                {
                                    isUserAdmin ? (
                                        <div className="flex">
                                            <Link href={"/semester/" + semester.id}
                                                  className="rounded-md mr-2 flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-uni bg-gray-400 hover:bg-uni hover:text-white mt-4">
                                                Edit
                                            </Link>
                                            <button name={semester.id} onClick={handleDeleteSemester}
                                                    className="rounded-md flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-uni bg-gray-400 hover:bg-uni hover:text-white mt-4">
                                                Delete
                                            </button>
                                        </div>
                                    ) : null
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
