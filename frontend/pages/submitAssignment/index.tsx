import {DocumentTextIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from "react";
import {validate_assignment, get_test_results} from '../../web3/src/entrypoints/assignments/assignments'
import Web3 from "web3";
import {get_semester} from "../../web3/src/entrypoints/config/semester";

export default function submitAssignment({userAddress}: { userAddress: string }) {
    const [semester, setSemester] = useState<{ id: string, name: any }>();
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    let web3;

    const testAssignment = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (!web3) {
            web3 = new Web3(window.ethereum);
        }

        const result = await validate_assignment(web3, userAddress, event.currentTarget.contractAddress.value, validation_contract_address);
        alert(JSON.stringify(result))
    }

    useEffect(() => {
        const data = sessionStorage.getItem('semesterList');

        if (data) {
            const id: string = JSON.parse(data)[0];

            get_semester(id).then((result) => {
                if (result.semester) {
                    const semester = {
                        id: id,
                        name: result.semester.name
                    }

                    setSemester(semester);
                }
            });
        }

        window.addEventListener('load', async () => {
            // Wait for loading completion to avoid race conditions with web3 injection timing.
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                } catch (error) {
                    console.error(error);
                }
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);
                web3 = new Web3(provider);
                console.log('No web3 instance injected, using Local web3.');
            }
        });
    }, []);


    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                    <form className="mt-8" action="http://localhost:8080/api/v1/account/send_gas" method="post">
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
                        <fieldset>
                            <legend className="contents text-base font-medium text-gray-900">Push Notifications</legend>
                            <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                            <div className="mt-4 space-y-4">
                                {semesters.map((semester) => {

                                })}
                                <div className="flex items-center">
                                    <input
                                        id="push-email"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="push-email"
                                           className="ml-3 block text-sm font-medium text-gray-700">
                                        Same as email
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="push-nothing"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="push-nothing"
                                           className="ml-3 block text-sm font-medium text-gray-700">
                                        No push notifications
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        <button
                            type="submit"
                            onClick={testAssignment}
                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DocumentTextIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                      aria-hidden="true"/>
                                </span>
                            Test assignment
                        </button>
                        <button
                            type="submit"

                            className="group relative mt-3 flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-uni focus:ring-offset-2"
                        >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DocumentTextIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                                      aria-hidden="true"/>
                                </span>
                            Submit assignment
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
