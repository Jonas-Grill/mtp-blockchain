import React, {useEffect, useState} from "react";
import {Semester} from "../../pages/semester";
import {DocumentMagnifyingGlassIcon, FireIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {getKnowledgeCoinBalanceInRange} from "../../web3/src/entrypoints/account/coin";
import {hasStudentPassedSemester} from "../../web3/src/entrypoints/account/exam";

export default function Admin({
                                  selectedSemester,
                                  getSemesterById,
                                  web3
                              }: { selectedSemester: string, getSemesterById: (id: string) => Semester | undefined, web3: any }) {
    const [students, setStudents] = useState<{ studentId: string, address: string, coins: number, missingCoins: number, passed: boolean }[]>([])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const studentId = data.get('studentId') as string;
        const address = data.get("address") as string;

        addStudent(address, studentId);
    }

    const handleMassSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const csv = data.get('csv') as File;

        csv.text().then((text) => {
            const lines = text.split("\n");

            //remove header if present
            //header is present if it doesn't start with a number
            if (isNaN(parseInt(lines[0].split(",")[0]))) {
                lines.shift();
            }

            lines.forEach((line) => {
                const [studentId, address] = line.split(",");
                addStudent(address.trim(), studentId.trim());
            });
        });
    }

    const addStudent = (address: string, studentId: string) => {
        const semester = getSemesterById(selectedSemester);

        if (address && semester && web3) {
            getKnowledgeCoinBalanceInRange(web3, address, semester.startBlock, semester.endBlock).then((result) => {
                hasStudentPassedSemester(web3, address, semester.id).then((passed) => {
                    setStudents((students) => [...students, {
                        studentId: studentId,
                        address: address,
                        coins: result,
                        missingCoins: getMissingCoins(result),
                        passed: passed
                    }]);
                });
            });
        }
    }

    const getMissingCoins = (coins: number) => {
        const semester = getSemesterById(selectedSemester);

        if (selectedSemester === "") return 0;
        if (semester === undefined) return 0;
        if (coins >= semester.minKnowledgeCoinAmount) return 0;

        return semester.minKnowledgeCoinAmount - coins;
    }

    useEffect(() => {
        const oldStudents = students;

        setStudents([]);

        oldStudents.forEach((student) => {
            addStudent(student.address, student.studentId);
        });
    }, [selectedSemester]);

    return (
        <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <label htmlFor="wallet-address" className="sr-only">
                    Student ID
                </label>
                <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    autoComplete="studentId"
                    required={false}
                    className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                    placeholder="Student ID (optional)"
                />
                <label htmlFor="address" className="sr-only">
                    Student address
                </label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="walletAddress"
                    required
                    className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-gray-500 focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                    placeholder="Wallet address"
                />

                <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                              aria-hidden="true"/>
                </span>
                    Check Knowledge of this address
                </button>
            </form>
            <form className="mt-8 space-y-6" onSubmit={handleMassSubmit}>
                <input
                    id="csv"
                    name="csv"
                    type="file"
                    autoComplete="csv"
                    required
                    className="relative block w-full appearance-none rounded-md shadow shadow-uni px-3 py-2 text-uni placeholder-uni focus:z-10 focus:border-uni focus:outline-none focus:ring-uni sm:text-sm"
                    placeholder="csv"
                />

                <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md shadow shadow-uni bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DocumentMagnifyingGlassIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                              aria-hidden="true"/>
                </span>
                    Check Knowledge of course
                </button>
            </form>
            {students.map((student) => (
                <div key={student.studentId}
                     className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-4 gap-x-8 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                        <dt className="col-span-2 text-lg font-medium text-gray-900">Student
                            ID: {student.studentId}</dt>
                        <dt className="col-span-2 text-lg font-medium text-gray-900">Student
                            address: {student.address}</dt>
                        <dt className="col-span-2 text-lg font-medium text-gray-900">Student coins: {student.coins}</dt>
                        <dt className="col-span-2 text-lg font-medium text-gray-900">Student missing
                            coins: {student.missingCoins}</dt>
                        <dt className="col-span-2 text-lg font-medium text-gray-900">Student
                            passed: {student.passed.toString()}</dt>
                    </div>
                </div>
            ))}
        </>
    )
}
