import React from "react";

const features = [
    { name: 'Who we are', description: 'We are Elias Anderlohr, Jonas Grill and Gina Weber. We are / were master students in business informatics at the University of Mannheim. We chose "A Blockchain-based system for course submissions" by Prof. Dr. Markus Strohmaier (Chair of Data Science in the Economic and Social Sciences) and Dr. Stefano Balietti as our Master Team Project. We started the project in fall semester 2022. The project was first launched in spring semester 2023.' },
    { name: 'What we did', description: 'The basic idea of Prof. Strohmaier was to teach blockchain by using a blockchain based learning system. Therefore, basic concepts such as block numbers and smart contracts are understood through using the system. We implemented a frontend with Next.js and tailwindCSS. The faucet was implemented via a Node.js backend. All other logical operations are running directly on-chain. The chain is running on six raspberry Pi´s in the University of Mannheim which are working via a proof of authority consensus algorithm. Only for the first distribution of gas (API) and the submission of student ID and wallet addresses, an off-chain system such as ILIAS is used to comply to data privacy rules.' },
    { name: 'Special thanks', description: 'We want to thank Prof. Strohmaier and Stefano Balietti for this amazing team project. With regular meetings we always got new input and could share ideas to create a new learning solution. Through that we are able to give students access to hands on experiences working with blockchain. So we also want to thank every student that enjoys our Knowledge Base, because we are very proud to have established this learning opportunity.' },
]

export default function About() {
    return (
        <div className="bg-white">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 px-4">
                <div>
                    <img
                        className="mx-auto w-3/4"
                        src="/now-logo.png"
                        alt="Uni Mannheim Logo"
                    />
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">A Blockchain-based system for course submissions</h2>
                    <p className="mt-4 text-gray-500 text-center">
                    The project was implemented as part of the "Team Project" course of the Business Informatics Masters at the University of Mannheim.
                    </p>
                    <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 text-center mb-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="border-t border-uni pt-4">
                                <dt className="font-medium text-gray-900">{feature.name}</dt>
                                <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
