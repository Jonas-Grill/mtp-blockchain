import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getSemester, getSemesterIds, deleteSemester} from "../../web3/src/entrypoints/config/semester"
import Head from "next/head";
import {AcademicCapIcon} from "@heroicons/react/20/solid";
import {initBlockchain} from "../faucet";

export const loadSemesters = async (web3: any) => {
    const semesters: { id: string, name: any, startBlock: any, endBlock: any, minKnowledgeCoinAmount: any }[] = [];
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
    return semesters;
}

export default function SemesterOverview() {
    const [semesters, setSemesters] = useState<{ id: string, name: any, startBlock: any, endBlock: any, minKnowledgeCoinAmount: any }[]>([]);

    let web3: any;

    const handleDeleteSemester = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.name;
        deleteSemester(web3, event.currentTarget.name);
    }

    useEffect(() => {
        initBlockchain(web3).then((result) => {
            web3 = result;

            loadSemesters(web3).then((result) => {
                setSemesters(result);
            });
        });
    }, []);

    return (
        <div className="flex-col">
            <Head>
                <title>Semester overview</title>
            </Head>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8">

                    <div className="mt-10">
                        <Link href={"/semester/createSemester"}
                              className="w-3/4 max-w-md space-y-8"
                        >
                            <button
                                type="button"

                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AcademicCapIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                     aria-hidden="true"/>
                                </span>
                                Add new semester
                            </button>
                        </Link>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {semesters.map((semester) => (
                            <div className="border-solid border-2 rounded-md border-uni p-2" key={semester.id}>
                                <h3 className="mt-1 text-lg font-medium text-gray-900">Semester: {semester.name}</h3>
                                <p className="mt-4 text-sm text-gray-700">Coin amount for
                                    exam: {semester.minKnowledgeCoinAmount}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.startBlock}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.endBlock}</p>
                                <div className="flex">
                                    <Link href={"/semester/"}
                                          className="rounded-md border border-transparent mr-2 bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
                                        Edit
                                    </Link>
                                    <button name={semester.id} onClick={handleDeleteSemester}
                                          className="rounded-md border border-transparent bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
