import Link from "next/link";

const semesters = [
    {
        id: 1,
        name: 'FSS 2021',
        href: '/semester/createSemester',
        startingBlock: '2',
        endBlock: '5',
        coinAmountForExam: '30',
    },
    {
        id: 2,
        name: 'HWS 2021',
        href: '#',
        startingBlock: '2',
        endBlock: '5',
        coinAmountForExam: '30',
    },
    {
        id: 3,
        name: 'FSS 2022',
        href: '#',
        startingBlock: '2',
        endBlock: '5',
        coinAmountForExam: '30',
    },
    {
        id: 4,
        name: 'HWS 2022',
        href: '#',
        startingBlock: '2',
        endBlock: '5',
        coinAmountForExam: '30',
    }
]

export default function SemesterOverview() {

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
                                    exam: {semester.coinAmountForExam}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.startingBlock}</p>
                                <p className="mt-4 text-sm text-gray-700">Starting block: {semester.endBlock}</p>
                                <div className="flex">
                                    <Link href={"/semester/"} className="rounded-md border border-transparent mr-2 bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
                                        Edit
                                    </Link>
                                    <Link href={"/semester/"} className="rounded-md border border-transparent bg-uni flex w-1/2 items-center justify-center py-3 px-8 text-center font-medium text-white hover:bg-sustail-dark mt-4">
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
