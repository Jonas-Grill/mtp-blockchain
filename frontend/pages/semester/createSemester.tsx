import {AcademicCapIcon} from '@heroicons/react/20/solid'
import {appendSemester} from "../../web3/src/entrypoints/config/semester"
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import Head from "next/head";
import {initBlockchain} from "../faucet";

export default function CreateSemester() {
    const router = useRouter();

    const [web3, setWeb3] = React.useState<any>(undefined);

    const createSemester = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3) {
            const data = new FormData(event.currentTarget);

            const name = data.get('name');
            const startingBlock = data.get('startBlock');
            const endBlock = data.get('endBlock');
            const coinAmountForExam = data.get('coinAmountForExam');

            appendSemester(web3, name, startingBlock, endBlock, coinAmountForExam).then((result) => {
                router.push('/semester');
            });

        }
    }

    useEffect(() => {
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
                    <title>Create semester</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Create a new semester
                        </h2>
                    </div>
                    <form className="mt-8" action="http://localhost:8080/api/v1/account/send_gas"
                          onSubmit={createSemester}>
                        <label htmlFor="name" className="sr-only">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Semester name"
                        />
                        <label htmlFor="startBlock" className="sr-only">
                            Starting block
                        </label>
                        <input
                            id="startBlock"
                            name="startBlock"
                            type="text"
                            required
                            className="relative mt-3 block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Starting block"
                        />
                        <label htmlFor="endBlock" className="sr-only">
                            End block
                        </label>
                        <input
                            id="endBlock"
                            name="endBlock"
                            type="text"
                            required
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="End block"
                        />
                        <label htmlFor="coinAmountForExam" className="sr-only">
                            Coin amount for exam
                        </label>
                        <input
                            id="coinAmountForExam"
                            name="coinAmountForExam"
                            type="text"
                            required
                            className="relative mt-3 block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Coin amount needed for exam qualification"
                        />

                        <button
                            type="submit"
                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AcademicCapIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                     aria-hidden="true"/>
                                </span>
                            Create semester
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

