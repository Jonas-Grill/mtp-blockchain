import Link from "next/link";

const assignments = [
    {
        id: 1,
        name: '1',
        href: '/assignments/createSemester',
        description: 'Tic Tac Toe',
        contractAddress: 'fbreipobqagvbqa'
    },
    {
        id: 2,
        name: '2022 01',
        href: '#',
        description: 'Simple ERC20',
        contractAddress: 'fbreipobqagvbqa'
    },
    {
        id: 3,
        name: '2022 03',
        href: '#',
        description: 'Simple NFT',
        contractAddress: 'fbreipobqagvbqa'
    },
    {
        id: 4,
        name: '4',
        href: '#',
        description: 'Hot potato',
        contractAddress: 'fbreipobqagvbqa'
    }
]

export default function AssignmentOverview() {

    return (
        <div className="flex-col">
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
                                <p className="mt-4 text-sm text-gray-700">Description: {assignment.description}</p>
                                <p className="mt-4 text-sm text-gray-700">Contract address: {assignment.contractAddress}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
