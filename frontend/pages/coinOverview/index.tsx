import Head from "next/head";
import React, {useEffect, useState} from "react";
import {loadSemesters, Semester} from "../semester";
import {initBlockchain} from "../faucet";
import {isAdmin} from "../../web3/src/entrypoints/config/admin";
import Student from "../../components/coin/Student";
import Admin from "../../components/coin/Admin";

export default function CoinOverview({userAddress}: { userAddress: string }) {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [web3, setWeb3] = useState<any>(undefined);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

    const getSemesterById = (id: string) => {
        return semesters.find((semester) => semester.id === id);
    }

    useEffect(() => {
        console.log("CoinOverview useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);
            });
        } else if (semesters.length <= 0) {
            loadSemesters(web3, isUserAdmin).then((result) => {
                if (result && result.length > 0) {
                    setSemesters(result);
                    setSelectedSemester(result[0].id);
                }
            });
        } else if (userAddress) {
            isAdmin(web3, userAddress).then((result) => {
                if (result !== isUserAdmin) {
                    setIsUserAdmin(result);

                    loadSemesters(web3, result).then((result) => {
                        if (result && result.length > 0) {
                            setSemesters(result);
                            setSelectedSemester(result[0].id);
                        }
                    });
                }
            });
        }
    }, [web3, semesters, selectedSemester, userAddress]);

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Coin overview</title>
                </Head>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="/uniMannheim.svg.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Knowledge overview
                        </h2>
                        <div className="mt-4 text-lg font-medium text-uni">
                            Choose the semester:
                        </div>
                        <fieldset>
                            <div className="mt-4 space-y-4">
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
                        {isUserAdmin ? (
                            <Admin selectedSemester={selectedSemester} getSemesterById={getSemesterById} web3={web3}/>
                        ) : (
                            <Student selectedSemester={selectedSemester} getSemesterById={getSemesterById} web3={web3}
                                     userAddress={userAddress}/>
                        )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
