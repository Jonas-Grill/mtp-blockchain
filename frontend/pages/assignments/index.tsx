import Link from "next/link";
import {deleteAssignment, getAssignment, getAssignmentIds} from "../../web3/src/entrypoints/config/assignment";
import React, {useEffect, useState} from "react";
import Head from "next/head";
import {DocumentTextIcon} from "@heroicons/react/20/solid";
import {initBlockchain} from "../faucet";
import {loadSemesters, Semester} from "../semester";
import {isAdmin} from "../../web3/src/entrypoints/config/admin";
import {deleteSemester} from "../../web3/src/entrypoints/config/semester";

export type Assignment = {
    id: string,
    name: string,
    link: string,
    validationContractAddress: string,
    startBlock: number,
    endBlock: number,
}

export const loadAssignments = async (semesterId: string, web3: any) => {
    const ids: string[] = await getAssignmentIds(web3, semesterId);
    const assignments: Assignment[] = [];

    for (let id of ids) {
        const assignment = await getAssignment(web3, semesterId, id);

        if (assignment) {
            assignments.push({
                id: id,
                name: assignment.name,
                link: assignment.link,
                validationContractAddress: assignment.validationContractAddress,
                startBlock: assignment.startBlock,
                endBlock: assignment.endBlock,
            });
        }
    }

    return assignments;
}

export default function AssignmentOverview({userAddress}: { userAddress: string }) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [web3, setWeb3] = useState<any>(undefined);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

    const handleDeleteAssignment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (web3) {
            deleteAssignment(web3, selectedSemester, event.currentTarget.name).then((result) => {
                loadAssignments(selectedSemester, web3).then((assignments) => {
                    setAssignments(assignments);
                });
            });
        }
    }

    useEffect(() => {
        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesters.length <= 0) {
            loadSemesters(web3).then((result) => {
                setSemesters(result);

                if (result && result.length > 0) {
                    setSelectedSemester(result[0].id);
                }
            });
        } else {
            loadAssignments(selectedSemester, web3).then((result) => {
                setAssignments(result);
            });
        }
        if (web3 && userAddress) {
            isAdmin(web3, userAddress).then((result) => {
                setIsUserAdmin(result);
            });
        }
    }, [web3, semesters, selectedSemester, userAddress]);

    return (
        <div className="flex-col">
            <Head>
                <title>Assignment overview</title>
            </Head>
            <div className="bg-white">
                <div className="mx-auto mt-10 max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8">
                    {
                        isUserAdmin ? (
                            <div className="mb-10">
                                <Link href={"/assignments/createAssignment"}
                                      className="w-3/4 max-w-md space-y-8"
                                >
                                    <button
                                        type="button"
                                        className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                                    >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DocumentTextIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                      aria-hidden="true"/>
                                </span>
                                        Add new assignment
                                    </button>
                                </Link>
                            </div>
                        ) : null
                    }
                    <div className="mb-2 text-lg font-medium text-uni">
                        Choose semester:
                    </div>
                    <fieldset>
                        <div className="space-y-2">
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
                    <div
                        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {assignments.map((assignment) => (
                            <div className="mt-4 shadow shadow-uni bg-gray-300 rounded-md p-2 w-auto" key={assignment.id}>
                                <h3 className="mt-1 text-lg font-medium text-uni">Assignment: {assignment.name}</h3>
                                <p className="mt-4 text-xs text-uni">Contract
                                    address: {assignment.validationContractAddress}</p>
                                <div className="flex justify-center">
                                    <button name={assignment.id} onClick={handleDeleteAssignment}
                                            className="rounded-md flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-uni bg-gray-400 hover:bg-uni hover:text-white mt-4">
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
