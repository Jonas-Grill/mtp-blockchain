import Link from "next/link";
import {useEffect, useState} from "react";
import {get_semester} from "../../web3/src/entrypoints/config/semester"
import Web3 from "web3";

export const loadSemesters = async () => {
    const data = sessionStorage.getItem('semesterList');

    if (data) {
        const web3 = new Web3(window.ethereum);

        const ids: string[] = JSON.parse(data);
        const semesters: { id: string, name: any, startBlock: any, endBlock: any, minKnowledgeCoinAmount: any }[] = [];

        for (let id of ids) {
            const result = await get_semester(web3, id);

            if (result.semester) {
                semesters.push({
                    id: id,
                    name: result.semester.name,
                    startBlock: result.semester.start_block,
                    endBlock: result.semester.end_block,
                    minKnowledgeCoinAmount: result.semester.min_knowledge_coin_amount
                });
            }
        }

        return semesters;
    }
}

export default function SemesterOverview() {
    const [semesters, setSemesters] = useState<{ id: string, name: any, startBlock: any, endBlock: any, minKnowledgeCoinAmount: any }[]>([]);

    useEffect(() => {
        loadSemesters().then((semesters) => {
            if (semesters) {
                setSemesters(semesters);
            }
        });
    }, []);

    return (
        <div className="flex-col">
            <div className="bg-white">
                <div className="mx-auto max-w-2xl py-16 px-4 sm:py-0 sm:px-6 lg:max-w-7xl lg:px-8">

                    <div className="mb-10">
                        <Link href={"/semester/createSemester"}
                              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-uni py-3 px-8 text-base font-medium text-white hover:bg-sustail-dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add new semester
                        </Link>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {semesters.map((semester) => (
                            <div className="border-solid border-2 rounded-md border-uni p-2" key={semester.id}>
                                <h3 className="mt-1 text-lg font-medium text-gray-900">Semester: {semester.name}</h3>
                                <p className="mt-4 text-sm text-gray-700">Coin amount for
                                    exam: {semester.minKnowledgeCoinAmount}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.startBlock}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.endBlock}</p>
                                <div className="flex">
                                    <Link href={"/semester/"}
                                          className="rounded-md border border-transparent mr-2 bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
                                        Edit
                                    </Link>
                                    <Link href={"/semester/"}
                                          className="rounded-md border border-transparent bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
                                        Delete
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
