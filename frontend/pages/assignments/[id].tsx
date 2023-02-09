import {AcademicCapIcon} from '@heroicons/react/20/solid'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {ParsedUrlQuery} from "querystring";
import {useRouter} from "next/router";
import {Assignment, loadAssignment} from "./index";
import {initBlockchain} from "../faucet";
import {
    setAssignmentAddress,
    setAssignmentName,
    setAssignmentStartBlock,
    setAssignmentEndBlock,
    setAssignmentLink
} from "../../web3/src/entrypoints/config/assignment";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {loadSemester, Semester} from "../semester";

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

export default function ChangeAssignment({id}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const [web3, setWeb3] = useState<any>();
    const [assignment, setAssignment] = useState<Assignment>();
    const [semester, setSemester] = useState<Semester>();

    // get the current semester from query params
    const semesterId = router.query.semesterId as string;

    const handleChangeAssignment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (web3 && assignment) {
            const data = new FormData(event.currentTarget);

            const name = data.get('name') as string;
            const startingBlock = data.get('startBlock') as string;
            const endBlock = data.get('endBlock') as string;
            const address = data.get('address') as string;
            const link = data.get('link') as string;

            const changePromises: Promise<void>[] = [];

            if (name && assignment.name != name) {
                changePromises.push(setAssignmentName(web3, semesterId, id, name));
            }
            if (startingBlock && assignment.startBlock != parseInt(startingBlock)) {
                changePromises.push(setAssignmentStartBlock(web3, semesterId, id, startingBlock));
            }
            if (endBlock && assignment.endBlock != parseInt(endBlock)) {
                changePromises.push(setAssignmentEndBlock(web3, semesterId, id, endBlock));
            }
            if (address && assignment.validationContractAddress != address) {
                changePromises.push(setAssignmentAddress(web3, semesterId, id, address));
            }
            if (link && assignment.link != link) {
                changePromises.push(setAssignmentLink(web3, semesterId, id, link));
            }

            Promise.all(changePromises).then(() => {
                router.push('/assignments');
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
        console.log("ChangeAssignment useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesterId && id) {
            loadSemester(web3, semesterId).then((semester) => {
                if (semester) {
                    setSemester(semester);
                }
            });

            loadAssignment(semesterId, web3, id).then((assignment) => {
                if (assignment) {
                    setAssignment(assignment);
                }
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
                            Change this assignment
                        </h2>
                    </div>
                    <form className="mt-8" onSubmit={handleChangeAssignment}>
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
                            defaultValue={assignment?.name}
                        />
                        <label htmlFor="startBlock" className="sr-only">
                            Starting block
                        </label>
                        <input
                            id="startBlock"
                            name="startBlock"
                            type="number"
                            min={parseInt(semester?.startBlock + "" || "0") || 0}
                            max={parseInt(semester?.endBlock + "" || "10000000") - 1}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value) {
                                    const endBlock = document.getElementById('endBlock');
                                    endBlock?.setAttribute('min', (parseInt(value) + 1) + '');
                                }
                            }}
                            required
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Starting block"
                            defaultValue={assignment?.startBlock}
                        />
                        <label htmlFor="endBlock" className="sr-only">
                            End block
                        </label>
                        <input
                            id="endBlock"
                            name="endBlock"
                            type="number"
                            min={parseInt(semester?.startBlock + "" || "0") + 1}
                            max={semester?.endBlock}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value) {
                                    const startBlock = document.getElementById('startBlock');
                                    startBlock?.setAttribute('max', (parseInt(value) - 1) + '');
                                }
                            }}
                            required
                            className="mb-2 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="End block"
                            defaultValue={assignment?.endBlock}
                        />
                        <label htmlFor="address" className="sr-only">
                            Assignment address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            required
                            className="mb-4 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Validator contract address"
                            defaultValue={assignment?.validationContractAddress}
                        />
                        <label htmlFor="link" className="sr-only">
                            Link to assignment task
                        </label>
                        <input
                            id="link"
                            name="link"
                            type="text"
                            required
                            className="mb-4 relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                            placeholder="Link to assignment task"
                            defaultValue={assignment?.link}
                        />

                        <button
                            type="submit"

                            className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <AcademicCapIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                     aria-hidden="true"/>
                                </span>
                            Change assignment
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
