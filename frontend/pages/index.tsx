import Head from 'next/head'
import React from "react";
import Link from "next/link";
import {BookOpenIcon, FireIcon} from "@heroicons/react/20/solid";

export default function Home() {
    return (
        <div className="w-full">
            <Head>
                <title>Knowledge Base</title>
            </Head>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <img
                        className="mx-auto w-auto"
                        src="/now-logo.png"
                        alt="Uni Mannheim Logo"
                    />
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Welcome to the Knowledge Base
                    </h2>
                    <h2 className="mt-4 text-center text-lg font-medium tracking-tight text-gray-900">
                        To get started, please select a category from the topbar or take a look at the documentation:
                    </h2>
                    <div className="mt-2 flex items-center justify-center">
                        <Link href="https://jonas-grill.github.io/mtp-blockchain/" className="w-3/4 max-w-md space-y-8">
                            <button
                                type="button"

                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-uni hover:bg-uni hover:text-white"
                            >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <BookOpenIcon className="h-5 w-5 text-uni group-hover:text-gray-400"
                                  aria-hidden="true" />
                    </span>
                                Documentation
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
