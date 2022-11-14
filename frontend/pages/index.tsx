import Head from 'next/head'
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <div className="w-full">
            {/*<Navbar/>*/}
            <Head>
                <title>Create Next App</title>
            </Head>
            <h2 className="italic text-slate-300">Hi</h2>
        </div>
    )
}
