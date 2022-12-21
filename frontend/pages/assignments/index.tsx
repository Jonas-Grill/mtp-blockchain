import Link from "next/link";
import Web3 from "web3";
import {get_assignment} from "../../web3/src/entrypoints/config/assignment";
import React, {useEffect, useState} from "react";
import Head from "next/head";

export const loadAssignments = async () => {
    const data = sessionStorage.getItem('assignmentList');

    if (data) {
        const web3 = new Web3(window.ethereum);

        const ids: { semester: string, id: string }[] = JSON.parse(data);
        const assignments: { id: string, name: any, link: any, validationContractAddress: any, startBlock: any, endBlock: any }[] = [];

        for (let id of ids) {
            const result = await get_assignment(web3, id.semester, id.id);

            if (result.semester) {
                assignments.push({
                    id: id.id,
                    name: result.semester.name,
                    link: result.semester.link,
                    validationContractAddress: result.semester.validation_contract_address,
                    startBlock: result.semester.start_block,
                    endBlock: result.semester.end_block,
                });
            }
        }

        return assignments;
    }
}

export default function AssignmentOverview() {
    const [assignments, setAssignments] = useState<{ id: string, name: any, link: any, validationContractAddress: any, startBlock: any, endBlock: any }[]>([]);

    useEffect(() => {
        loadAssignments().then((assignments) => {
            if (assignments) {
                setAssignments(assignments);
            }
        });
    }, []);

    return (
        <div className="flex-col">
            <Head>
                <title>Assignment overview</title>
            </Head>
            <div className="bg-white">
                <div className="mx-auto mt-10 max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="mb-10">
                        <Link href={"/assignments/createAssignment"}
                              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-uni py-3 px-8 text-base font-medium text-white hover:bg-sustail-dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add new assignment
                        </Link>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {assignments.map((assignment) => (
                            <div className="border-solid border-2 rounded-md border-uni p-2" key={assignment.id}>
                                <h3 className="mt-1 text-lg font-medium text-gray-900">Assignment: {assignment.name}</h3>
                                <p className="mt-4 text-sm text-gray-700">Contract
                                    address: {assignment.validationContractAddress}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
