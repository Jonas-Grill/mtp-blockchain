export default function CoinDisplay({ minKnowledgeCoinAmount, coins, missingCoins }: { minKnowledgeCoinAmount: number | undefined, coins: number, missingCoins: number }) {
    return (
        <div className="mx-auto grid grid-cols-1 items-center gap-y-4 py-8 lg:max-w-7xl">
            <div className="grid grid-cols-3 shadow shadow-uni bg-gray-300 rounded-md p-2">
                <dt className="col-span-2 text-lg font-medium text-gray-900">Knowledge needed for exam:</dt>
                <dt className="text-lg font-medium text-gray-900 text-right">{minKnowledgeCoinAmount}</dt>
            </div>
            <div className="grid grid-cols-3 shadow shadow-uni bg-gray-300 rounded-md p-2">
                <dt className="col-span-2 text-lg font-medium text-gray-900">Your current knowledge:
                </dt>
                <dt className="text-lg font-medium text-green-600 text-right">{coins}</dt>
            </div>
            <div className="grid grid-cols-3 shadow shadow-uni bg-gray-300 rounded-md p-2">
                <dt className="col-span-2 text-lg font-medium text-gray-900">Your missing knowledge:
                </dt>
                <dt className="text-lg font-medium text-red-600 text-right">{missingCoins}</dt>
            </div>
        </div>
    )
}
