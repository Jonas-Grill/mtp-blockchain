import Link from "next/link";
import Web3 from "web3";
import {get_assignment} from "../../web3/src/entrypoints/config/assignment";
import React, {useEffect, useState} from "react";
import Head from "next/head";
import {ClockIcon, DocumentPlusIcon, DocumentTextIcon} from "@heroicons/react/20/solid";
import {initBlockchain} from "../faucet";
import {loadSemesters} from "../semester";

export const loadAssignments = async (web3: any) => {
    const ids: { semester: string, id: string }[] = [/*TDOD: get all assignment ids*/];
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

export default function AssignmentOverview() {
    const [assignments, setAssignments] = useState<{ id: string, name: any, link: any, validationContractAddress: any, startBlock: any, endBlock: any }[]>([]);

    let web3: any;

    useEffect(() => {
        initBlockchain(web3).then((result) => {
            web3 = result;

            loadAssignments(web3).then((assignments) => {
                if (assignments) {
                    setAssignments(assignments);
                }
            });
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
                              className="w-3/4 max-w-md space-y-8"
                        >
                            <button
                                type="button"

                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DocumentTextIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                      aria-hidden="true"/>
                                </span>
                                Add new assignment
                            </button>
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
