import {DocumentTextIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from "react";
import Web3 from "web3";
import {appendAssignment} from "../../web3/src/entrypoints/config/assignment";
import {loadSemesters} from "../semester";
import {useRouter} from "next/router";
import Head from "next/head";
import {initBlockchain} from "../faucet";

export default function CreateAssignment() {
    const router = useRouter();
    let web3;

    const [semesters, setSemesters] = useState<{ id: string, name: any }[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    useEffect(() => {
        loadSemesters().then((semesters) => {
            if (semesters) {
                setSemesters(semesters);
                setSelectedSemester(semesters[0].id);
            }

        });

        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        }
    }, []);

    const createAssignment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3) {
            const data = new FormData(event.currentTarget);

            const name = data.get('name');
            const link = data.get('link');
            const contractAddress = data.get('contractAddress');
            const startBlock = data.get('startBlock');
            const endBlock = data.get('endBlock');

            appendAssignment(web3, selectedSemester, name, link, contractAddress, startBlock, endBlock)
            router.push('/assignments');
        }
    }

    useEffect(() => {
        initBlockchain(web3).then((result) => {
            web3 = result;
        });
    }, []);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Create assignment</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Create a new assignment
                        </h2>
                    </div>
                    <form className="mt-8" onSubmit={createAssignment}>
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
                        <label htmlFor="name" className="sr-only">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Assignment name"
                        />
                        <label htmlFor="link" className="sr-only">
                            Link to assignment task
                        </label>
                        <input
                            id="link"
                            name="link"
                            type="text"
                            required
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Link to assignment task"
                        />
                        <label htmlFor="contractAddress" className="sr-only">
                            Contract address
                        </label>
                        <input
                            id="contractAddress"
                            name="contractAddress"
                            type="text"
                            required
                            className="relative mt-3 block w-full appearance-none rounded-none rounded-t-md border border-gray-400 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Contract address"
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
                        <button
                            type="submit"

                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DocumentTextIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                      aria-hidden="true"/>
                                </span>
                            Create assignment
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

