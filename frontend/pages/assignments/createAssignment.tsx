import {DocumentTextIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from "react";
import {appendAssignment} from "../../web3/src/entrypoints/config/assignment";
import {loadSemesters, Semester} from "../semester";
import {useRouter} from "next/router";
import Head from "next/head";
import {initBlockchain} from "../faucet";

export default function CreateAssignment() {
    const router = useRouter();

    const [web3, setWeb3] = useState<any>(undefined);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    const createAssignment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3) {
            const data = new FormData(event.currentTarget);

            const name = data.get('name');
            const link = data.get('link');
            const contractAddress = data.get('contractAddress');
            const startBlock = data.get('startBlock');
            const endBlock = data.get('endBlock');

            appendAssignment(web3, selectedSemester, name, link, contractAddress, startBlock, endBlock).then(() => {
                router.push("/assignments");
            }).catch((error) => {
                console.log(error.code)
                if (error.code === "INVALID_ARGUMENT") {
                    alert(`${error.value} is not a valid ${error.reason.substring(
                        error.reason.indexOf('="') + 2,
                        error.reason.indexOf('",')
                    )}`);
                } else if (error.code == "-32603" || error.code == "-32000") {
                    alert("Either you are using an invalid contract or your end block is smaller or equal to your start block!")
                } else {
                    console.error(error.message);
                }
            });
        }
    }

    const getSemesterById = (id: string) => {
        return semesters.find((semester) => semester.id === id);
    }

    useEffect(() => {

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else {
            loadSemesters(web3).then((result) => {
                setSemesters(result);

                if (result && result.length > 0) {
                    setSelectedSemester(result[0].id);
                }
            });
        }
    }, [web3]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Create assignment</title>
                </Head>
                <div className="w-full max-w-md ">
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
                    <div className="mt-4 text-lg font-medium text-uni">
                        Choose semester:
                    </div>
                    <form className="mt-2" onSubmit={createAssignment}>
                        <fieldset>
                            <div className="space-y-2 mb-4">
                                {semesters.map((semester) => (
                                    <div className="flex items-center" key={semester.id}>
                                        <input
                                            id={semester.id}
                                            name="semester"
                                            type="radio"
                                            className="h-4 w-4 text-uni focus:ring-transparent"
                                            checked={semester.id === selectedSemester}
                                            onChange={() => setSelectedSemester(semester.id)}
                                        />
                                        <label htmlFor="semester"
                                               className="ml-3 block text-sm font-medium text-uni">
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
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
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
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
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
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Contract address"
                        />
                        <label htmlFor="startBlock" className="sr-only">
                            Starting block
                        </label>
                        <input
                            id="startBlock"
                            name="startBlock"
                            type="number"
                            min={getSemesterById(selectedSemester)?.startBlock}
                            max={getSemesterById(selectedSemester)?.endBlock}
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
                            min={getSemesterById(selectedSemester)?.startBlock}
                            max={getSemesterById(selectedSemester)?.endBlock}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value) {
                                    const startBlock = document.getElementById('startBlock');
                                    startBlock?.setAttribute('max', value);
                                }
                            }}
                            required
                            className="mb-4 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="End block"
                        />
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
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

