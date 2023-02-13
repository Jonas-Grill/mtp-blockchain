import React, {useEffect, useState} from "react";
import {Semester} from "../../pages/semester";
import {DocumentMagnifyingGlassIcon, FireIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {getKnowledgeCoinBalanceInRange} from "../../web3/src/entrypoints/account/coin";
import {hasStudentPassedSemester, hasStudentsPassedSemesterCSV} from "../../web3/src/entrypoints/account/exam";

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
            hasStudentsPassedSemesterCSV(web3, text, selectedSemester).then((result) => {            
                const element = document.createElement("a");
                const file = new Blob([result], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "students.txt";
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
            });
        });
    }

    const addStudent = (address: string, studentId: string) => {
        const semester = getSemesterById(selectedSemester);

        if (address === "") {
            alert(`Contract address for ${studentId} is empty`);
            return;
        } else if (!web3.utils.isAddress(address)) {
            alert(`Contract address for ${studentId} is invalid`);
            return;
        }

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
        console.log("Admin useEffect");

        const oldStudents = students;

        setStudents([]);

        oldStudents.forEach((student) => {
            addStudent(student.address, student.studentId);
        });
    }, [selectedSemester]);

    return (
        <>
            <div className="mt-5 text-lg font-medium text-uni">
                            Check a single Student:
                        </div>
            <div className="mt-4 text-md font-medium text-uni">
            
                For one student, enter the student ID (optional) and the students wallet address:
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
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
            <hr className="mt-4"/>
            <div className="mt-5 text-lg font-medium text-uni">
                            Check multiple Students:
                        </div>
            <div className="mt-4 text-md font-medium text-uni">
                For multiple students, please provide a csv file where the sixth column (6th) is the wallets address and the seventh column (7th) is the student ID.
                <br></br><br></br>
                <button 
                    type="button"
                    className="group relative flex justify-center rounded-md shadow shadow-uni py-1 px-3 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                    onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([`"Nachname";"Vorname";"Benutzername";"Bearbeitungsdauer";"Umfrage beendet";"What is your crypto address?";"What is your matriculation number at Uni Mannheim"
"Mustermann";"Max";"mmsuter";"12";"06. Feb 2023, 15:11";"0xFf9AE49627e512312c519dF0439156d4635f626C";"1234567"`], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = "students.csv";
                        document.body.appendChild(element); // Required for this to work in FireFox
                        element.click();
                    }}
                >
                    Download CSV example
                </button>
                <br></br>
            </div>
            <form className="mt-3 space-y-3" onSubmit={handleMassSubmit}>
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
                    <div className="grid grid-cols-3 shadow shadow-uni rounded-md p-2 bg-gray-300">
                        <dt className="col-span-2 text-lg font-medium text-uni">Student
                            ID: <b>{student.studentId}</b></dt>
                        <dt className="col-span-2 text-md font-medium text-uni">Student
                            address: <b>{student.address}</b></dt>
                        <dt className="col-span-2 text-lg font-medium text-uni">NOW coins: <b>{student.coins} </b></dt>
                        <dt className="col-span-2 text-lg font-medium text-uni">Missing NOW coins: <b>{student.missingCoins}</b></dt>
                        <dt className="col-span-2 text-lg font-medium text-uni">Passed: <b style={{color: student.passed.toString() === "true" ? "green" : "red"}}>{student.passed.toString()}</b></dt>
                    </div>
                </div>
            ))}
        </>
    )
}
