const testContract =
    {
        id: 1,
        overallScore: '08/10',
        testOne: '1/3',
        testTwo: '5/5',
        testThree: '2/2',
    }

export default function submitForTesting() {
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
                            Your contract would score: {testContract.overallScore}
                        </h2>
                        <div
                            className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-4 gap-x-8 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Score for test 1 would be:</dt>
                                <dt className="text-lg font-medium text-gray-900 text-right">{testContract.testOne}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Score for test 2 would be:</dt>
                                <dt className="text-lg font-medium text-gray-900 text-right">{testContract.testTwo}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 text-lg font-medium text-gray-900">Score for test 3 would be:</dt>
                                <dt className="text-lg font-medium text-gray-900 text-right">{testContract.testThree}</dt>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
