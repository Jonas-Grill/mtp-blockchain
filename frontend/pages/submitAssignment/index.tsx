import {
    ArrowUpTrayIcon,
    DocumentMagnifyingGlassIcon,
    DocumentTextIcon,
    PaperAirplaneIcon
} from '@heroicons/react/20/solid'
import React, { useEffect, useState } from "react";
import { validateAssignment, getTestResults } from '../../web3/src/entrypoints/assignments/assignments'
import Web3 from "web3";
import { loadSemesters } from "../semester";
import { useRouter } from "next/router";
import { loadAssignments } from "../assignments";
import Head from "next/head";

export default function submitAssignment({ userAddress }: { userAddress: string }) {
    const router = useRouter();

    let web3;

    const [semesters, setSemesters] = useState<{ id: string, name: any }[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    const [assignments, setAssignments] = useState<{ id: string, name: any, validationContractAddress: any }[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<string>("");

    const testAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!web3) {
            web3 = new Web3(window.ethereum);
        }

        const data = new FormData(event.currentTarget);
        const contractAddress = data.get('contractAddress') as string;

        const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

        if (assignment) {
            validateAssignment(web3, userAddress, contractAddress, assignment.validationContractAddress).then((result) => {
                alert(JSON.stringify(result));

                if (!web3) {
                    web3 = new Web3(window.ethereum);
                }

                getTestResults(web3, contractAddress, result.id).then((result) => {
                    alert(JSON.stringify(result));
                });
            });
        }
    }

    useEffect(() => {
        loadSemesters().then((semesters) => {
            if (semesters) {
                setSemesters(semesters);
                setSelectedSemester(semesters[0].id);
            }
        });

        loadAssignments().then((assignments) => {
            if (assignments) {
                setAssignments(assignments);
                setSelectedAssignment(assignments[0].id);
            }
        });
    }, []);


    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Submit assignment</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Hand in your assignment contract here
                        </h2>
                        <h2 className="mt-2 text-center text-lg font-medium tracking-tight text-gray-900">
                            Current assignment: 2
                        </h2>
                        <h2 className="mt-2 text-center text-lg font-medium tracking-tight text-gray-900">
                            Remaining test tries: 2/3
                        </h2>
                    </div>
                    <form className="mt-8" onSubmit={testAssignment}>
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
                        <fieldset>
                            <div className="mt-4 space-y-4">
                                {assignments.map((assignment) => (
                                    <div className="flex items-center">
                                        <input
                                            id={assignment.id}
                                            name="assignment"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={assignment.id === selectedAssignment}
                                            onChange={() => setSelectedAssignment(assignment.id)}
                                        />
                                        <label htmlFor="assignment"
                                            className="ml-3 block text-sm font-medium text-gray-700">
                                            {assignment.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
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
                        <button
                            type="submit"
                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                    aria-hidden="true" />
                            </span>
                            Test assignment
                        </button>
                        <button
                            type="submit"

                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <ArrowUpTrayIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                    aria-hidden="true" />
                            </span>
                            Submit assignment
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
