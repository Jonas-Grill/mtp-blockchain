import {AcademicCapIcon} from '@heroicons/react/20/solid'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {ParsedUrlQuery} from "querystring";
import {useRouter} from "next/router";
import {loadSemester, Semester} from "./index";
import {initBlockchain} from "../faucet";
import {
    setSemesterAmountKnowledgeCoins,
    setSemesterName,
    setSemesterEndBlock,
    setSemesterStartBlock
} from "../../web3/src/entrypoints/config/semester";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";

interface IParams extends ParsedUrlQuery {
    id: string
}

export const getServerSideProps: GetServerSideProps<{ id: string | undefined }> = async (context) => {
    const {id} = context.params as IParams;

    return {
        props: {
            id: id
        }
    }
}

export default function ChangeSemester({id}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const [web3, setWeb3] = useState<any>();
    const [semester, setSemester] = useState<Semester>();

    const handleChangeSemester = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3 && semester) {
            const data = new FormData(event.currentTarget);

            const name = data.get('name') as string;
            const startingBlock = data.get('startBlock') as string;
            const endBlock = data.get('endBlock') as string;
            const coinAmountForExam = data.get('coinAmountForExam') as string;

            const changePromises: Promise<void>[] = [];

            if (name && semester.name != name) {
                changePromises.push(setSemesterName(web3, semester.id, name));
            }
            if (startingBlock && semester.startBlock != parseInt(startingBlock)) {
                changePromises.push(setSemesterStartBlock(web3, semester.id, startingBlock));
            }
            if (endBlock && semester.endBlock != parseInt(endBlock)) {
                changePromises.push(setSemesterEndBlock(web3, semester.id, endBlock));
            }
            if (coinAmountForExam && semester.minKnowledgeCoinAmount != parseInt(coinAmountForExam)) {
                changePromises.push(setSemesterAmountKnowledgeCoins(web3, semester.id, coinAmountForExam));
            }

            Promise.all(changePromises).then(() => {
                router.push('/semester');
            }).catch((error) => {
                if (error.code == -32603) {
                    alert("Start block must be smaller than the smallest assignment start block!")
                } else {
                    alert("Something went wrong while changing the semester!")
                    alert(error.message);
                }
            });
        }
    }

    useEffect(() => {
        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (!semester && id) {
            loadSemester(web3, id).then((semester) => {
                setSemester(semester);
            });
        }
    }, [web3])


    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Change semester</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Change this semester
                        </h2>
                    </div>
                    <form className="mt-8" onSubmit={handleChangeSemester}>
                        <label htmlFor="name" className="sr-only">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Semester name"
                            defaultValue={semester?.name}
                        />
                        <label htmlFor="startBlock" className="sr-only">
                            Starting block
                        </label>
                        <input
                            id="startBlock"
                            name="startBlock"
                            type="number"
                            min={0}
                            max={100000000}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value) {
                                    const endBlock = document.getElementById('endBlock');
                                    endBlock?.setAttribute('min', parseInt(value) + 1 + '');
                                }
                            }}
                            required
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Starting block"
                        />
                        <label htmlFor="endBlock" className="sr-only">
                            End block
                        </label>
                        <input
                            id="endBlock"
                            name="endBlock"
                            type="number"
                            min={1}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value) {
                                    const startBlock = document.getElementById('startBlock');
                                    startBlock?.setAttribute('max', value);
                                }
                            }}
                            required
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="End block"
                        />
                        <label htmlFor="coinAmountForExam" className="sr-only">
                            Coin amount for exam
                        </label>
                        <input
                            id="coinAmountForExam"
                            name="coinAmountForExam"
                            type="text"
                            min={0}
                            required
                            className="mb-4 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Coin amount needed for exam qualification"
                            defaultValue={semester?.minKnowledgeCoinAmount}
                        />

                        <button
                            type="submit"

                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AcademicCapIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                     aria-hidden="true"/>
                                </span>
                            Change semester
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
