import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import MetaMaskAuth from "./MetaMaskAuth";
import {useEffect, useState} from "react";
import Link from "next/link";
import {isAdmin} from "../web3/src/entrypoints/config/admin"
import {getCurrentBlockNumber} from "../web3/src/entrypoints/utils/utils"
import {initBlockchain} from "../pages/faucet";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({
                                   userAddress,
                                   setUserAddress,
                                   web3,
                                   setWeb3
                               }: { userAddress: string, setUserAddress: (address: string) => void, web3: any, setWeb3: (web3: any) => void }) {
    const initialNavItems = [
        {name: 'Faucet', href: '/faucet', current: false, admin: false},
        {name: 'Semester', href: '/semester', current: false, admin: false},
        {name: 'Assignments', href: '/assignments', current: false, admin: false},
        {name: 'Coin overview', href: '/coinOverview', current: false, admin: false},
        {name: 'Submit assignment', href: '/submitAssignment', current: false, admin: false},
        {name: 'Admin functions', href: '/admin', current: false, admin: true},
        {name: 'Sign', href: '/sign', current: false, admin: false},
        {name: 'About', href: '/about', current: false, admin: false},
    ]

    const [navigation, setNavigation] = useState<{ name: string, href: string, current: boolean, admin: boolean }[]>(initialNavItems);
    const [blockNumber, setBlockNumber] = useState<number>();
    const [mutex, setMutex] = useState(0);

    const updateBlockNumber = async () => {
        let currentBlock = 0;

        while (web3) {
            if (mutex > 1) {
                await setMutex(prevState => prevState - 1);
                break;
            }

            const block = await getCurrentBlockNumber(web3).catch((e) => {
                console.error(e);
                return "0";
            });

            if (block === "0") {
                if (web3) {
                    await new Promise(r => setTimeout(r, 12000));
                } else {
                    setMutex(prevState => prevState - 1)
                    break;
                }
            } else if (block === currentBlock) {
                await new Promise(r => setTimeout(r, 1000));
            } else {
                currentBlock = block;
                setBlockNumber(block);
                await new Promise(r => setTimeout(r, 11000));
            }
        }
    }

    useEffect(() => {
        console.log("Navbar useEffect");

        if (!web3) {
            initBlockchain(web3).then((web3) => {
                setWeb3(web3);

                setUserAddress(web3.eth.accounts[0]);
            });
        } else if (userAddress) {
            isAdmin(web3, userAddress).then((result) => {
                if (result) {
                    setNavigation(initialNavItems);
                } else {
                    setNavigation(initialNavItems.filter((item) => !item.admin));
                }
            }).catch((e) => {
                alert("Error while checking if user is admin: " + e.message);
            });
        }
        if (web3) {
            if (mutex === 0) {
                setMutex(prevState => prevState + 1);
                updateBlockNumber();
            }
        }
    }, [web3, userAddress]);

    return (
        <Disclosure as="nav" className="bg-gray-300">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-uni hover:text-white">
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
                                    <Link href="/">
                                        <img
                                            className="block h-10 w-auto lg:hidden"
                                            src="/uniMannheim.svg.png"
                                            alt="Your Company"
                                        />
                                    </Link>
                                    <Link href="/">
                                        <img
                                            className="hidden h-10 w-auto lg:block"
                                            src="/uniMannheim.svg.png"
                                            alt="Your Company"
                                        />
                                    </Link>
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
                                className="hidden sm:ml-6 sm:block">
                                <div className="flex items-center pr-2 sm:ml-6 sm:pr-0 divide-uni divide-x">
                                    <div
                                        className="text-sm font-medium text-uni items-center mr-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                        {web3 ? `Block: ${blockNumber}` : null}
                                    </div>
                                    <div>
                                        <MetaMaskAuth setUserAddress={setUserAddress} userAddress={userAddress}/>
                                    </div>
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
                                    onClick={(event: any) => {
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
