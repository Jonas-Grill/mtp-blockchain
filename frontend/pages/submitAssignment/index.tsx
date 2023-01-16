import {ArrowUpTrayIcon, DocumentMagnifyingGlassIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from "react";
import {
    getTestIndexes,
    getTestResults,
    submitAssignment,
    validateAssignment,
    getSubmittedAssignment,
} from '../../web3/src/entrypoints/assignments/assignments'
import {loadSemesters, Semester} from "../semester";
import {Assignment, loadAssignments} from "../assignments";
import Head from "next/head";
import {initBlockchain} from "../faucet";

export default function SubmitAssignment({userAddress}: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);
    const [contract, setContract] = useState<string>("");

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<string>("");

    const [testResults, setTestResults] = useState<string[][][]>([]);

    const [submittedAssignment, setSubmittedAssignment] = useState<{ testIndex: string, studentAddress: string, contractAddress: string, knowledgeCoins: string, blockNo: string }>();

    const handleTestAssignment = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (web3) {
            const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

            if (assignment) {
                validateAssignment(web3, contract, assignment.validationContractAddress).then((result) => {
                    getTestResults(web3, assignment.validationContractAddress, result).then((result) => {
                        setTestResults((results) => [...results, result]);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }

    const handleSubmitAssignment = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (web3) {
            const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

            if (assignment) {
                submitAssignment(web3, contract, assignment.validationContractAddress).then((result) => {
                    setSubmittedAssignment(result);
                }).catch((error) => {
                    if (error.code === -32603) {
                        const message = error.message.substring(
                            error.message.indexOf('"message"') + 2,
                            error.message.indexOf('",')
                        );
                        console.log(message);

                        alert(message.substring(
                            message.indexOf('Error:') + 7,
                            message.indexOf('!')
                        ));
                    } else {
                        console.log(error);
                    }
                });
            }
        }
    }

    const loadTestResults = async (web3: any, userAddress: string, contractAddress: string) => {
        const ids = await getTestIndexes(web3, userAddress, contractAddress);
        if (ids.length > 0) {
            return await Promise.all(ids.map(async (id: string) => {
                return await getTestResults(web3, contractAddress, id);
            }));
        }
    }

    useEffect(() => {
        const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesters.length <= 0) {
            loadSemesters(web3).then((semesters) => {
                setSemesters(semesters);

                if (semesters.length > 0) {
                    setSelectedSemester(semesters[0].id);
                }
            });
        } else if (assignments.length <= 0) {
            loadAssignments(selectedSemester, web3).then((assignments) => {
                setAssignments(assignments);

                if (assignments.length > 0) {
                    setSelectedSemester(assignments[0].id);
                }
            });
        } else if (assignment) {
            loadTestResults(web3, userAddress, assignment.validationContractAddress).then((results) => {
                if (results) {
                    setTestResults(results);
                }
            });
            getSubmittedAssignment(web3, userAddress, assignment.validationContractAddress).then((result) => {
                if (result) {
                    setSubmittedAssignment(result);
                }
            });
        } else {
            setSelectedAssignment(assignments[0].id);
        }
    }, [web3, semesters, selectedSemester, assignments, contract, selectedAssignment]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Submit assignment</title>
                </Head>
                <div className="w-full max-w-md space-y-2">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
                            Hand in your assignment contract here
                        </h2>
                    </div>
                    <label htmlFor="semester"
                           className="text-center text-lg font-medium tracking-tight text-uni">
                        Choose Semester
                    </label>
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
                    <label htmlFor="assignment"
                           className="text-center text-lg font-medium tracking-tight text-uni">
                        Choose Assignment
                    </label>
                    <fieldset>
                        <div className="space-y-2">
                            {assignments.map((assignment) => (
                                <div className="flex items-center" key={assignment.id}>
                                    <input
                                        id={assignment.id}
                                        name="assignment"
                                        type="radio"
                                        className="h-4 w-4 text-uni focus:ring-transparent"
                                        checked={assignment.id === selectedAssignment}
                                        onChange={() => setSelectedAssignment(assignment.id)}
                                    />
                                    <label htmlFor="assignment"
                                           className="ml-3 block text-sm font-medium text-uni">
                                        {assignment.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                    <input
                        id="contractAddress"
                        name="contractAddress"
                        type="text"
                        required
                        className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                        placeholder="Contract address"
                        onChange={(event) => setContract(event.currentTarget.value)}
                    />

                    <div className="py-6">
                        <button
                            onClick={handleTestAssignment}
                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                             aria-hidden="true"/>
                            </span>
                            Test assignment
                        </button>
                        <div className="mt-1 text-uni">
                            Test results:
                        </div>
                        {testResults && testResults.length >= 0 ? (
                            <>
                                {testResults.map((results, index) => (
                                    <div key={index}
                                         className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-4 gap-x-8 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                        Try {index}
                                        {results.map((testResult, i) => (
                                            <div key={i}
                                                 className="grid grid-cols-3 rounded-md shadow shadow-uni p-2">
                                                <dt className="col-span-2 text-lg font-medium text-uni">Test: {i}</dt>
                                                <dt className="col-span-2 text-lg font-medium text-uni">Test
                                                    name: {testResult[0]}</dt>
                                                <dt className="col-span-2 text-lg font-medium text-uni">Passed: {testResult[1]?.toString()}</dt>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ) : null
                        }
                        <button
                            onClick={handleSubmitAssignment}
                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <ArrowUpTrayIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                 aria-hidden="true"/>
                            </span>
                            Submit assignment
                        </button>
                        {
                            submittedAssignment && submittedAssignment.blockNo != "0" ? (
                                <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                    <dt className="col-span-2 text-lg font-medium text-gray-900">Test index: {submittedAssignment.testIndex}</dt>
                                    <dt className="col-span-2 text-lg font-medium text-gray-900">Block number: {submittedAssignment.blockNo}</dt>
                                    <dt className="col-span-2 text-lg font-medium text-gray-900">Coins: {submittedAssignment.knowledgeCoins}</dt>
                                    <dt className="col-span-2 text-lg font-medium text-gray-900">Contract address: {submittedAssignment.contractAddress}</dt>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <p className="text-uni">
                                        You have not submitted the assignment yet.
                                    </p>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </>
    )
}
