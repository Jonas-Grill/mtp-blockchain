const coins =
    {
        id: 1,
        knowledgeNeededForExam: '30',
        currentKnowledge: '25',
        missingKnowledge: '5',
    }

export default function coinOverview() {
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
                            Your knowledge
                        </h2>
                        <div
                            className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-4 gap-x-8 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 font-medium text-gray-900">Knowledge needed for exam:</dt>
                                <dt className="font-medium text-gray-900 text-right">{coins.knowledgeNeededForExam}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 font-medium text-gray-900">Your current knowledge:</dt>
                                <dt className="font-medium text-green-600 text-right">{coins.currentKnowledge}</dt>
                            </div>
                            <div className="grid grid-cols-3 border-solid border-2 rounded-md border-uni p-2">
                                <dt className="col-span-2 font-medium text-gray-900">Your missing knowledge:</dt>
                                <dt className="font-medium text-red-600 text-right">{coins.missingKnowledge}</dt>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
