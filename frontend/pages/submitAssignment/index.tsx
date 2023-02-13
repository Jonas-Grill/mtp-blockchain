import {ArrowUpTrayIcon, DocumentMagnifyingGlassIcon, ExclamationCircleIcon} from '@heroicons/react/24/outline'
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
import {isAdmin} from "../../web3/src/entrypoints/config/admin";
import {Fragment, useRef} from 'react'
import {Dialog, Transition} from '@headlessui/react'

export default function SubmitAssignment({userAddress}: { userAddress: string }) {
    const [web3, setWeb3] = useState<any>(undefined);
    const [contract, setContract] = useState<string>("");

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<string>("");

    const [testResults, setTestResults] = useState<string[][][]>([]);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

    const [submittedAssignment, setSubmittedAssignment] = useState<{ testIndex: string, studentAddress: string, contractAddress: string, knowledgeCoins: string, blockNo: string, lateSubmission: string }>();


    const validateTestAndSubmitConditions = () => {
        if (contract === "") {
            alert("Please enter your contract address")
            return false
        } else if (!web3.utils.isAddress(contract)) {
            alert("Please enter a valid contract address")
            return false
        } else if (selectedAssignment === "") {
            alert("Please select an assignment")
            return false
        } else if (selectedSemester === "") {
            alert("Please select a semester")
            return false
        }
        return true
    }

    const handleTestAssignment = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (web3 && validateTestAndSubmitConditions()) {
            const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

            console.log("assignment", assignment?.validationContractAddress);

            if (assignment) {
                validateAssignment(web3, contract, assignment.validationContractAddress).then((result) => {
                    getTestResults(web3, assignment.validationContractAddress, result).then((result) => {
                        setTestResults((results) => [...results, result]);
                    });
                }).catch((error) => {
                    alert(error.message);
                    alert("Something went wrong! Did you enter the correct contract address?\n" +
                        "Did you implement all the required functions?\n" +
                        "Did you name the functions correctly?\n");

                });
            }
        }
    }

    const handleSubmitAssignment = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setOpen(false)

        if (web3 && validateTestAndSubmitConditions()) {
            const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

            if (assignment) {
                submitAssignment(web3, contract, assignment.validationContractAddress).then((result) => {
                    setSubmittedAssignment(result);
                }).catch((error) => {
                    alert(error.message);
                    alert("Something went wrong! Did you enter the correct contract address?\n" +
                        "Did you implement all the required functions?\n" +
                        "Did you name the functions correctly?\n");
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
        console.log("SubmitAssignment useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesters.length <= 0) {
            loadSemesters(web3, isUserAdmin).then((semesters) => {
                if (semesters && semesters.length > 0) {
                    setSemesters(semesters);
                    setSelectedSemester(semesters[0].id);
                }
            });
        } else {
            loadAssignments(selectedSemester, web3, isUserAdmin).then((result) => {
                // Only update if the result is different
                if ((result && result.length > 0) || assignments.length > 0) {
                    if (result.length !== assignments.length || result[0].id !== assignments[0].id) {
                        setAssignments(result);

                        if (result && result.length > 0 && result[0].id !== selectedAssignment) {
                            setSelectedAssignment(result[0].id);
                        }
                    }
                }
            });
        }

        if (web3 && userAddress) {
            isAdmin(web3, userAddress).then((result) => {
                if (result !== isUserAdmin) {
                    setIsUserAdmin(result);

                    loadSemesters(web3, result).then((semesters) => {
                        if (semesters && semesters.length > 0) {
                            setSemesters(semesters);
                            setSelectedSemester(semesters[0].id);
                        }
                    });
                }
            });
        }

        const assignment = assignments.find(assignment => assignment.id === selectedAssignment);

        if (assignment) {
            loadTestResults(web3, userAddress, assignment.validationContractAddress).then((results) => {
                if (results) {
                    setTestResults(results);
                } else {
                    setTestResults([]);
                }
            });
            getSubmittedAssignment(web3, userAddress, assignment.validationContractAddress).then((result) => {
                if (result) {
                    setSubmittedAssignment(result);
                } else {
                    setSubmittedAssignment(undefined);
                }
            });
        }
    }, [web3, semesters, selectedSemester, assignments, selectedAssignment, userAddress, isUserAdmin]);

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
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div
                                    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel
                                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div
                                                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 sm:mx-0 sm:h-10 sm:w-10">
                                                        <ExclamationCircleIcon className="h-6 w-6 text-uni"
                                                                               aria-hidden="true"/>
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <Dialog.Title as="h3"
                                                                      className="text-lg font-medium leading-6 text-uni">
                                                            Submit assignment
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-600">
                                                                Are you sure you want to submit your assignment?
                                                                You can only submit once. This action cannot be undone.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-gray-300 px-4 py-2 text-base font-medium text-uni hover:bg-uni hover:text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                                    onClick={handleSubmitAssignment}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-300 px-4 py-2 text-base font-medium text-uni hover:bg-uni hover:text-white focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                    onClick={() => setOpen(false)}
                                                    ref={cancelButtonRef}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                    {
                        isUserAdmin ? (
                            <>
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
                                                    onChange={() => setSelectedSemester(semester.id)}/>
                                                <label htmlFor="semester"
                                                       className="ml-3 block text-sm font-medium text-uni">
                                                    {semester.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </>
                        ) : null
                    }
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
                        placeholder="Your contract address"
                        onChange={(event) => setContract(event.currentTarget.value)}
                    />

                    <div className="py-6">
                        <button
                            onClick={() => {
                                if (validateTestAndSubmitConditions()) {
                                    setOpen(true);
                                }
                            }}
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
                                <div className="mt-2 mb-2 grid grid-cols-3 rounded-md shadow shadow-uni p-2">
                                    <dt className="col-span-2 text-lg font-medium text-uni">Block
                                        number: <b>{submittedAssignment.blockNo}</b></dt>
                                    <dt className="col-span-2 text-lg font-medium text-uni">Coins: <b>{submittedAssignment.knowledgeCoins}</b></dt>
                                    <dt className="col-span-2 text-lg font-medium text-uni">Contract
                                        address: <b>{submittedAssignment.contractAddress}</b></dt>
                                    <dt className="col-span-2 text-lg font-medium text-uni">Late Submision: <b>{submittedAssignment.lateSubmission.toString()}</b></dt>

                                </div>
                            ) : (
                                <div className="mt-1 mb-1 ">
                                    <p className="text-uni">
                                        You have not submitted the assignment yet.
                                    </p>
                                </div>
                            )
                        }
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
                        <div className="mt-1 text-lg font-medium text-uni">
                            Test results:
                        </div>
                        {testResults && testResults.length >= 0 ? (
                            <>
                                {testResults.map((results, index) => (
                                    <div key={index}
                                         className="mx-auto grid max-w-2xl grid-cols-1 items-center">
                                        <details>
                                            <summary className="text-lg font-medium text-uni">Test assignment:
                                                Try {index + 1}</summary>
                                            {results.map((testResult, i) => (
                                                <div key={i}
                                                     className="mt-2 mb-2 grid grid-cols-3 rounded-md shadow shadow-uni p-2">
                                                    <dt className="col-span-2 text-lg font-medium text-uni">Test number: <b>{i}</b></dt>
                                                    <dt className="col-span-2 text-lg font-medium text-uni">{testResult[0]}</dt>
                                                    <dt className="col-span-2 text-lg font-medium text-uni" style={{color: testResult[1]?.toString() === "true" ? "green" : "red"}}>Passed: <b>{testResult[1]?.toString()}</b></dt>
                                                </div>
                                            ))}
                                        </details>
                                    </div>
                                ))}
                            </>
                        ) : null
                        }

                    </div>

                </div>
            </div>
        </>
    )
}
