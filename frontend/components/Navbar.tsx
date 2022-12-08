import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import MetaMaskAuth from "./MetaMaskAuth";
import {useState} from "react";
import Link from "next/link";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({setUserAddress}) {
    const [navigation, setNavigation] = useState([
        {name: 'Faucet', href: '/faucet', current: false},
        {name: 'Semester', href: '/semester', current: true},
        {name: 'Assignments', href: '/assignments', current: false},
        {name: 'Coin overview', href: '/coinOverview', current: false},
    ]);

    return (
        <Disclosure as="nav" className="bg-gray-300">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-uni hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-10 w-auto lg:hidden"
                                        src="/uniMannheim.svg.png"
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-10 w-auto lg:block"
                                        src="/uniMannheim.svg.png"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                accessKey={item.name}
                                                onClick={(event) => {
                                                    let tmpNav = navigation;
                                                    for (let i = 0; i < tmpNav.length; i++) {
                                                        if (tmpNav[i].name == event.currentTarget.accessKey) {
                                                            tmpNav[i].current = true;
                                                        } else if (tmpNav[i].current) {
                                                            tmpNav[i].current = false;
                                                        }
                                                    }
                                                    setNavigation(tmpNav);
                                                }}
                                                className={classNames(
                                                    item.current ? 'bg-uni text-white' : 'text-uni bg-gray-400 hover:bg-uni hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div>
                                    <MetaMaskAuth onAddressChanged={function (userAddress: any) {
                                        setUserAddress(userAddress);
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    accessKey={item.name}
                                    onClick={(event) => {
                                        let tmpNav = navigation;
                                        for (let i = 0; i < tmpNav.length; i++) {
                                            if (tmpNav[i].name == event.currentTarget.accessKey) {
                                                tmpNav[i].current = true;
                                            } else if (tmpNav[i].current) {
                                                tmpNav[i].current = false;
                                            }
                                        }
                                        setNavigation(tmpNav);
                                    }}
                                    className={classNames(
                                        item.current ? 'bg-uni text-white' : 'text-uni bg-gray-400 hover:bg-uni hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
